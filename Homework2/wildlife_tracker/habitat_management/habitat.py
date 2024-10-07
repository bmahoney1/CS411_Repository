from typing import Any, List, Optional

from wildlife_tracker.animal_management.animal import Animal


class Habitat:

    def __init__(self,
                habitat_id: int,
                geographic_area: str,
                size: int,
                environment_type: str,
                animals: Optional[List[int]] = None) -> None:
        self.habitat_id = habitat_id
        self.geographic_area = geographic_area
        self.size = size
        self.environment_type = environment_type
        self.details = {}
        self.details["geographic_area"] = self.geographic_area
        self.details["size"] = self.size
        self.details["environment_type"] = self.environment_type
        self.animals = animals or []
        self.details["animals"] = self.animals
        

    def update_habitat_details(self, **kwargs: dict[str: Any]) -> None:
        self.details["geographic_area"] = kwargs.geographic_area
        self.details["size"] = kwargs.size
        self.details["environment_type"] = kwargs.environment_type
        self.details["animals"] = kwargs.animals
        

    def assign_animals_to_habitat(self, animals: List[Animal]) -> None:
        self.animals += animals
        

    def get_animals_in_habitat(self) -> List[Animal]:
        return self.animals
        

    def get_habitat_details(self) -> dict:
        return self.details

    