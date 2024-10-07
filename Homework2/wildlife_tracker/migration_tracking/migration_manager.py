from typing import Dict, List, Optional

from wildlife_tracker.habitat_management.habitat import Habitat
from wildlife_tracker.migration_tracking.migration import Migration
from wildlife_tracker.migration_tracking.migration_path import MigrationPath

class MigrationManager:
    def __init__(self):
        self.migrations: Dict[int, Migration] = {}
        self.paths: Dict[int, MigrationPath] = {}

    def schedule_migration(self, migration_path: MigrationPath) -> None:
        self.paths[migration_path.path_id] = MigrationPath

    def cancel_migration(self, migration_id: int) -> None:
        if migration_id in self.migrations:
            del self.migrations[migration_id]

    def get_migration_by_id(self, migration_id: int) -> Optional[Migration]:
        return self.migrations[migration_id]

    def get_migrations(self) -> List[Migration]:
        migrations_list = []
        for migration in self.migrations.values():
            migrations_list.append(migration)
        return migrations_list

    def get_migrations_by_status(self, status: str) -> List[Migration]:
        matching_migrations = []
        for mig in self.migrations.values():
            if mig.status == status:
                matching_migrations.append(mig)
        return matching_migrations

    def get_migrations_by_current_location(self, current_location: str) -> List[Migration]:
        matching_migrations = []
        for mig in self.migrations.values():
            if mig.migration_path.start_location == current_location:
                matching_migrations.append(mig)
        return matching_migrations

    def get_migrations_by_migration_path(self, migration_path_id: int) -> List[Migration]:
        matching_migrations = []
        for mig in self.migrations.values():
            if mig.migration_path.path_id == migration_path_id:
                matching_migrations.append(mig)
        return matching_migrations

    def get_migrations_by_start_date(self, start_date: str) -> List[Migration]:
        matching_migrations = []
        for mig in self.migrations.values():
            if mig.start_date == start_date:
                matching_migrations.append(mig)
        return matching_migrations

    def create_migration_path(self, path_id: int, species: str, start_location: Habitat, destination: Habitat, duration: Optional[int] = None) -> MigrationPath:
        path = MigrationPath(path_id, species, start_location, destination, duration)
        self.paths[path_id] = path
        return path

    def remove_migration_path(self, path_id: int) -> None:
        if path_id in self.paths:
            del self.paths[path_id]

    def get_migration_path_by_id(self, path_id: int) -> Optional[MigrationPath]:
        return self.paths[path_id]

    def get_migration_paths(self) -> List[MigrationPath]:
        migration_paths = []
        for path in self.paths.values():
            migration_paths.append(path)
        return migration_paths

    def get_migration_paths_by_destination(self, destination: Habitat) -> List[MigrationPath]:
        matching_paths = []
        for path in self.paths.values():
            if path.destination == destination:
                matching_paths.append(path)
        return matching_paths

    def get_migration_paths_by_species(self, species: str) -> List[MigrationPath]:
        matching_paths = []
        for path in self.paths.values():
            if path.species == species:
                matching_paths.append(path)
        return matching_paths

    def get_migration_paths_by_start_location(self, start_location: Habitat) -> List[MigrationPath]:
        matching_paths = []
        for path in self.paths.values():
            if path.start_location == start_location:
                matching_paths.append(path)
        return matching_paths

