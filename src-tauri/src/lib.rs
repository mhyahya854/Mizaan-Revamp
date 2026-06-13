use serde::{Deserialize, Serialize};
use std::{
    fs::{self, OpenOptions},
    io::Write,
    path::{Path, PathBuf},
    time::{SystemTime, UNIX_EPOCH},
};

const VAULT_METADATA_FILE: &str = "mizaan.vault.json";
const VAULT_APP_NAME: &str = "Mizaan";
const VAULT_KIND: &str = "mizaan-vault";
const VAULT_SCHEMA_VERSION: u16 = 1;
const REQUIRED_VAULT_FOLDERS: [&str; 5] = ["items", "files", "backups", "exports", ".mizaan"];

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NativeVaultMetadata {
    app: String,
    kind: String,
    schema_version: u16,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NativeVaultOpenResult {
    path: String,
    metadata_path: String,
    created: bool,
    metadata: NativeVaultMetadata,
    warnings: Vec<String>,
}

fn current_timestamp() -> String {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or(0);
    format!("unix-ms-{millis}")
}

fn normalize_input_path(path: impl AsRef<Path>) -> Result<PathBuf, String> {
    let path = path.as_ref();
    if path.as_os_str().is_empty() {
        return Err("Vault path is required.".to_string());
    }

    Ok(path.to_path_buf())
}

fn metadata_path(path: &Path) -> PathBuf {
    path.join(VAULT_METADATA_FILE)
}

fn new_metadata() -> NativeVaultMetadata {
    let now = current_timestamp();
    NativeVaultMetadata {
        app: VAULT_APP_NAME.to_string(),
        kind: VAULT_KIND.to_string(),
        schema_version: VAULT_SCHEMA_VERSION,
        created_at: now.clone(),
        updated_at: now,
    }
}

fn validate_metadata(metadata: NativeVaultMetadata) -> Result<NativeVaultMetadata, String> {
    if metadata.app != VAULT_APP_NAME
        || metadata.kind != VAULT_KIND
        || metadata.schema_version != VAULT_SCHEMA_VERSION
    {
        return Err(
            "Folder is not a Mizaan vault or uses an unsupported vault schema.".to_string(),
        );
    }

    Ok(metadata)
}

fn read_metadata(path: &Path) -> Result<NativeVaultMetadata, String> {
    let metadata_file = metadata_path(path);
    let raw = fs::read_to_string(&metadata_file)
        .map_err(|_| format!("Missing or unreadable {VAULT_METADATA_FILE}."))?;
    let metadata = serde_json::from_str::<NativeVaultMetadata>(&raw)
        .map_err(|_| format!("{VAULT_METADATA_FILE} is not valid Mizaan vault metadata."))?;
    validate_metadata(metadata)
}

fn expected_folder_warnings(path: &Path) -> Vec<String> {
    REQUIRED_VAULT_FOLDERS
        .iter()
        .filter_map(|folder| {
            let folder_path = path.join(folder);
            if folder_path.is_dir() {
                None
            } else {
                Some(format!("Expected vault folder is missing: {folder}"))
            }
        })
        .collect()
}

fn is_directory_empty(path: &Path) -> Result<bool, String> {
    let mut entries =
        fs::read_dir(path).map_err(|_| "Vault folder is not readable.".to_string())?;
    Ok(entries.next().is_none())
}

fn write_metadata_new(path: &Path, metadata: &NativeVaultMetadata) -> Result<(), String> {
    let metadata_file = metadata_path(path);
    let raw = serde_json::to_string_pretty(metadata)
        .map_err(|_| "Could not serialize Mizaan vault metadata.".to_string())?;
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&metadata_file)
        .map_err(|_| format!("Could not create {VAULT_METADATA_FILE} without overwriting."))?;
    file.write_all(raw.as_bytes())
        .map_err(|_| format!("Could not write {VAULT_METADATA_FILE}."))?;
    file.write_all(b"\n")
        .map_err(|_| format!("Could not finish writing {VAULT_METADATA_FILE}."))?;
    Ok(())
}

fn create_vault_at_path(path: impl AsRef<Path>) -> Result<NativeVaultOpenResult, String> {
    let path = normalize_input_path(path)?;
    if path.exists() && !path.is_dir() {
        return Err("Vault path exists but is not a folder.".to_string());
    }

    if path.is_dir() && metadata_path(&path).is_file() {
        return open_vault_at_path(path);
    }

    if path.is_dir() && !is_directory_empty(&path)? {
        return Err(
            "Vault folder is not empty and does not contain Mizaan vault metadata.".to_string(),
        );
    }

    fs::create_dir_all(&path).map_err(|_| "Could not create vault folder.".to_string())?;
    for folder in REQUIRED_VAULT_FOLDERS {
        fs::create_dir_all(path.join(folder))
            .map_err(|_| format!("Could not create expected vault folder: {folder}"))?;
    }

    let metadata = new_metadata();
    write_metadata_new(&path, &metadata)?;

    Ok(NativeVaultOpenResult {
        path: path.to_string_lossy().to_string(),
        metadata_path: metadata_path(&path).to_string_lossy().to_string(),
        created: true,
        metadata,
        warnings: Vec::new(),
    })
}

fn open_vault_at_path(path: impl AsRef<Path>) -> Result<NativeVaultOpenResult, String> {
    let path = normalize_input_path(path)?;
    if !path.is_dir() {
        return Err("Vault path does not exist or is not a folder.".to_string());
    }

    let metadata = read_metadata(&path)?;
    let warnings = expected_folder_warnings(&path);

    Ok(NativeVaultOpenResult {
        path: path.to_string_lossy().to_string(),
        metadata_path: metadata_path(&path).to_string_lossy().to_string(),
        created: false,
        metadata,
        warnings,
    })
}

#[tauri::command]
fn mizaan_create_vault(path: String) -> Result<NativeVaultOpenResult, String> {
    create_vault_at_path(path)
}

#[tauri::command]
fn mizaan_open_vault(path: String) -> Result<NativeVaultOpenResult, String> {
    open_vault_at_path(path)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            mizaan_create_vault,
            mizaan_open_vault
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{fs, path::PathBuf};

    fn temp_path(name: &str) -> PathBuf {
        let mut path = std::env::temp_dir();
        path.push(format!(
            "mizaan-native-vault-test-{}-{}",
            std::process::id(),
            name
        ));
        let _ = fs::remove_dir_all(&path);
        path
    }

    #[test]
    fn create_vault_builds_portable_structure_in_new_nested_folder() {
        let path = temp_path("new-nested").join("Folder With Spaces");

        let result = create_vault_at_path(&path).expect("vault should be created");

        assert!(path.join("mizaan.vault.json").is_file());
        assert!(path.join("items").is_dir());
        assert!(path.join("files").is_dir());
        assert!(path.join("backups").is_dir());
        assert!(path.join("exports").is_dir());
        assert!(path.join(".mizaan").is_dir());
        assert!(result.created);
        assert!(result.warnings.is_empty());

        let _ = fs::remove_dir_all(temp_path("new-nested"));
    }

    #[test]
    fn create_vault_refuses_unrelated_non_empty_folder() {
        let path = temp_path("non-empty");
        fs::create_dir_all(&path).expect("folder should be created");
        fs::write(path.join("personal.txt"), "keep me").expect("fixture file should be written");

        let err = create_vault_at_path(&path).expect_err("unrelated folder must be rejected");

        assert!(err.contains("not empty"));
        assert_eq!(
            fs::read_to_string(path.join("personal.txt")).expect("fixture should remain"),
            "keep me"
        );

        let _ = fs::remove_dir_all(path);
    }

    #[test]
    fn open_vault_accepts_valid_metadata() {
        let path = temp_path("valid-open");
        create_vault_at_path(&path).expect("vault should be created");

        let result = open_vault_at_path(&path).expect("vault should open");

        assert!(!result.created);
        assert_eq!(result.metadata.schema_version, 1);
        assert!(result.warnings.is_empty());

        let _ = fs::remove_dir_all(path);
    }

    #[test]
    fn open_vault_rejects_missing_metadata() {
        let path = temp_path("missing-metadata");
        fs::create_dir_all(&path).expect("folder should be created");

        let err = open_vault_at_path(&path).expect_err("missing metadata must be rejected");

        assert!(err.contains("mizaan.vault.json"));

        let _ = fs::remove_dir_all(path);
    }

    #[test]
    fn open_vault_rejects_invalid_metadata() {
        let path = temp_path("invalid-metadata");
        fs::create_dir_all(&path).expect("folder should be created");
        fs::write(
            path.join("mizaan.vault.json"),
            r#"{"app":"Other","kind":"mizaan-vault","schemaVersion":1,"createdAt":"fixture","updatedAt":"fixture"}"#,
        )
        .expect("metadata fixture should be written");

        let err = open_vault_at_path(&path).expect_err("invalid metadata must be rejected");

        assert!(err.contains("not a Mizaan vault"));

        let _ = fs::remove_dir_all(path);
    }

    #[test]
    fn open_vault_reports_missing_expected_folders_without_recreating_them() {
        let path = temp_path("missing-folder");
        create_vault_at_path(&path).expect("vault should be created");
        fs::remove_dir(path.join("items")).expect("items folder should be removable");

        let result = open_vault_at_path(&path).expect("vault should still be recognizable");

        assert!(result
            .warnings
            .iter()
            .any(|warning| warning.contains("items")));
        assert!(!path.join("items").exists());

        let _ = fs::remove_dir_all(path);
    }
}
