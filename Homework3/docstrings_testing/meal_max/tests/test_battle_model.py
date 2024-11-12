# I wrote the battle tests
import pytest
from meal_max.models.kitchen_model import Meal
from meal_max.models.battle_model import BattleModel
from unittest.mock import patch


@pytest.fixture()
def battle_model():
    """Fixture to provide a new instance of BattleModel for each test."""
    return BattleModel()


@pytest.fixture
def sample_combatant1():
    return Meal(id=1, meal="Pasta", cuisine="Italian", price=15.5, difficulty="MED")


@pytest.fixture
def sample_combatant2():
    return Meal(id=2, meal="Sushi", cuisine="Japanese", price=20.0, difficulty="HIGH")


# Prep and Clear Combatants Test Cases

def test_prep_combatant(battle_model, sample_combatant1):
    """Test preparing a combatant."""
    battle_model.prep_combatant(sample_combatant1)
    assert len(battle_model.combatants) == 1, "Expected 1 combatant in the list"
    assert battle_model.combatants[0].meal == "Pasta", "Expected first combatant to be 'Pasta'"

def test_prep_combatant_full_list(battle_model, sample_combatant1, sample_combatant2):
    """Test adding a combatant when the combatants list is already full."""
    battle_model.prep_combatant(sample_combatant1)
    battle_model.prep_combatant(sample_combatant2)
    
    with pytest.raises(ValueError, match="Combatant list is full, cannot add more combatants."):
        battle_model.prep_combatant(sample_combatant1)

def test_clear_combatants(battle_model, sample_combatant1):
    """Test clearing combatants."""
    battle_model.prep_combatant(sample_combatant1)
    battle_model.clear_combatants()
    assert len(battle_model.combatants) == 0, "Expected combatants list to be empty after clearing"

# Battle Test Cases

# @patch("meal_max.models.battle_model.get_random", return_value=0.05)
# @patch("meal_max.models.battle_model.update_meal_stats")
# def test_battle(mock_update_meal_stats, mock_get_random, battle_model, sample_combatant1, sample_combatant2):
#     """Test conducting a battle between two combatants."""
#     battle_model.prep_combatant(sample_combatant1)
#     battle_model.prep_combatant(sample_combatant2)

#     winner = battle_model.battle()

#     assert winner == "Sushi", "Expected Sushi to be the winner"
#     assert len(battle_model.combatants) == 1, "Expected 1 combatant left after the battle"
#     assert battle_model.combatants[0].meal == "Sushi", "Expected remaining combatant to be 'Sushi'"
#     mock_update_meal_stats.assert_any_call(sample_combatant2.id, 'win')
#     mock_update_meal_stats.assert_any_call(sample_combatant1.id, 'loss')
@patch("meal_max.models.battle_model.get_random", return_value=0.05)
@patch("meal_max.models.battle_model.update_meal_stats")
def test_battle(mock_update_meal_stats, mock_get_random, battle_model, sample_combatant1, sample_combatant2):
    """Test conducting a battle between two combatants."""
    # Set up sample scores directly or mock `get_battle_score`
    with patch.object(battle_model, 'get_battle_score', side_effect=[0.07, 0.12]):
        # Prep the combatants
        battle_model.prep_combatant(sample_combatant1)
        battle_model.prep_combatant(sample_combatant2)

        # Run the battle
        winner = battle_model.battle()

        # Assert the expected outcomes
        assert winner == "Sushi", "Expected Sushi to be the winner"
        assert len(battle_model.combatants) == 1, "Expected 1 combatant left after the battle"
        assert battle_model.combatants[0].meal == "Sushi", "Expected remaining combatant to be 'Sushi'"
        mock_update_meal_stats.assert_any_call(sample_combatant2.id, 'win')
        mock_update_meal_stats.assert_any_call(sample_combatant1.id, 'loss')


def test_battle_not_enough_combatants(battle_model, sample_combatant1):
    """Test battle with fewer than two combatants raises ValueError."""
    battle_model.prep_combatant(sample_combatant1)

    with pytest.raises(ValueError, match="Two combatants must be prepped for a battle."):
        battle_model.battle()

# Get Combatants and Scores Test Cases

def test_get_combatants(battle_model, sample_combatant1, sample_combatant2):
    """Test retrieving combatants."""
    battle_model.prep_combatant(sample_combatant1)
    battle_model.prep_combatant(sample_combatant2)

    combatants = battle_model.get_combatants()
    assert len(combatants) == 2, "Expected 2 combatants in the list"
    assert combatants[0].meal == "Pasta", "Expected first combatant to be 'Pasta'"
    assert combatants[1].meal == "Sushi", "Expected second combatant to be 'Sushi'"

def test_get_battle_score(battle_model, sample_combatant1):
    """Test calculating the battle score for a combatant."""
    score = battle_model.get_battle_score(sample_combatant1)
    expected_score = (15.5 * len("Italian")) - 2  # Based on difficulty "MED"
    assert score == expected_score, f"Expected battle score to be {expected_score}, but got {score}"
