from typing import Dict, List, Optional


from wildlife_tracker.habitat_management.habitat import Habitat


class HabitatManager:
    def __init__(self):
        self.habitats: Dict[int, Habitat] = {}

    def create_habitat(self, habitat_id: int, geographic_area: str, size: int, environment_type: str) -> Habitat:
        habitat = Habitat(habitat_id, geographic_area, size, environment_type)
        self.habitats[habitat_id] = habitat
        return habitat

    def remove_habitat(self, habitat_id: int) -> None:
        if habitat_id in self.habitats:
            del self.habitats[habitat_id]

    def get_habitat_by_id(self, habitat_id: int) -> Optional[Habitat]:
        return self.habitats[habitat_id]

    def get_habitats_by_geographic_area(self, geographic_area: str) -> List[Habitat]:
        temp = []
        for habitat in self.habitats.values():
            if habitat.geographic_area == geographic_area:
                temp.append(habitat)
        return temp

    def get_habitats_by_size(self, size: int) -> List[Habitat]:
        temp = []
        for habitat in self.habitats.values():
            if habitat.size == size:
                temp.append(habitat)
        return temp

    def get_habitats_by_type(self, environment_type: str) -> List[Habitat]:
        temp = []
        for habitat in self.habitats.values():
            if habitat.environment_type == environment_type:
                temp.append(habitat)
        return temp
