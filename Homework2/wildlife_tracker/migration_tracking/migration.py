from typing import Optional, Any


from wildlife_tracker.migration_tracking.migration_path import MigrationPath

class Migration:
    def __init__(self, migration_id: int, species: str, migration_path: MigrationPath, start_date: str, status: str = "Scheduled"):
        self.migration_id = migration_id
        self.species = species
        self.migration_path = migration_path
        self.start_date = start_date
        self.status = status

    def get_migration_details(self) -> dict[str, Any]:
        return {
            "migration_id": self.migration_id,
            "species": self.species,
            "migration_path": self.migration_path,
            "start_date": self.start_date,
            "status": self.status
        }

    def update_migration_details(self, **kwargs: Any) -> None:
        for key, value in kwargs.items():
            setattr(self, key, value)
