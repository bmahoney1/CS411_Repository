from typing import Optional, List

from wildlife_tracker.animal_management.animal import Animal

class AnimalManager:

    def __init__(self) -> None:
        self.animals: dict[int, Animal] = {}

    def get_animal_by_id(self, animal_id: int) -> Optional[Animal]:
        if animal_id in self.animals:
            return self.animals[animal_id]
        
    def register_animal(self, animal: Animal) -> None:
        self.animals[animal.animal_id] = animal
                
    def remove_animal(self, animal_id: int) -> None:
        if animal_id in self.animals:
            del self.animals[animal_id]

    def assign_animals_to_habitat(self, habitat_id: int, animals: List[Animal]) -> None:
        # Logic for assigning animals to a habitat
        pass