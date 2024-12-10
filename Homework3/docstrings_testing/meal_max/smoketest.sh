# I wrote the smoketests
#!/bin/bash

# Define the base URL for the Flask API
BASE_URL="http://localhost:5001/api"

# Flag to control whether to echo JSON output
ECHO_JSON=false

# Parse command-line arguments
while [ "$#" -gt 0 ]; do
  case $1 in
    --echo-json) ECHO_JSON=true ;;
    *) echo "Unknown parameter passed: $1"; exit 1 ;;
  esac
  shift
done



# Health checks


# Function to check the health of the service
check_health() {
  echo "Checking health status..."
  curl -s -X GET "$BASE_URL/health" | grep -q '"status": "healthy"'
  if [ $? -eq 0 ]; then
    echo "Service is healthy."
  else
    echo "Health check failed."
    exit 1
  fi
}

# Function to check the database connection
check_db() {
  echo "Checking database connection..."
  curl -s -X GET "$BASE_URL/db-check" | grep -q '"database_status": "healthy"'
  if [ $? -eq 0 ]; then
    echo "Database connection is healthy."
  else
    echo "Database check failed."
    exit 1
  fi
}



# Meals Management


create_meal() {
  meal=$1
  cuisine=$2
  price=$3
  difficulty=$4

  echo "Adding meal ($meal, $cuisine, $price, $difficulty) to the database..."
  response=$(curl -s -X POST "$BASE_URL/create-meal" -H "Content-Type: application/json" \
    -d "{\"meal\":\"$meal\", \"cuisine\":\"$cuisine\", \"price\":$price, \"difficulty\":\"$difficulty\"}")
  
  if echo "$response" | grep -q '"status": "success"'; then
    echo "Meal added successfully."
  else
    echo "Failed to add meal."
    exit 1
  fi
}

clear_meals() {
  echo "Clearing all meals..."
  curl -s -X DELETE "$BASE_URL/clear-meals" | grep -q '"status": "success"'
}

delete_meal_by_id() {
  meal_id=$1
  echo "Deleting meal by ID ($meal_id)..."
  curl -s -X DELETE "$BASE_URL/delete-meal/$meal_id" | grep -q '"status": "success"'
}

get_meal_by_id() {
  meal_id=$1
  echo "Getting meal by ID ($meal_id)..."
  response=$(curl -s -X GET "$BASE_URL/get-meal-by-id/$meal_id")
  
  if echo "$response" | grep -q '"status": "success"'; then
    echo "Meal retrieved successfully by ID."
    if [ "$ECHO_JSON" = true ]; then
      echo "Meal JSON (ID $meal_id):"
      echo "$response" | jq .
    fi
  else
    echo "Failed to retrieve meal by ID."
    exit 1
  fi
}

get_meal_by_name() {
  meal_name=$1
  echo $meal_name
  echo "Getting meal by name ($meal_name)..."
  echo "Hello"
  response=$(curl -s -X GET "$BASE_URL/get-meal-by-name/$meal_name")
  echo $response
  if echo "$response" | grep -q '"status": "success"'; then
    echo "Meal retrieved successfully by name."
    if [ "$ECHO_JSON" = true ]; then
      echo "Meal JSON (name $meal_name):"
      echo "$response" | jq .
    fi
  else
    echo "Failed to retrieve meal by name."
    exit 1
  fi
}

# get_meal_by_name() {
#   meal_name=$1
#   echo "Getting meal by name ($meal_name)..."
#   response=$(curl -s -G --data-urlencode "meal_name=$meal_name" "$BASE_URL/get-meal-by-name/$meal_name")
  
#   if echo "$response" | grep -q '"status": "success"'; then
#     echo "Meal retrieved successfully by name."
#     if [ "$ECHO_JSON" = true ]; then
#       echo "Meal JSON (name $meal_name):"
#       echo "$response"
#     fi
#   else
#     echo "Failed to retrieve meal by name."
#     exit 1
#   fi
# }


# Battle

initiate_battle() {
  echo "Initiating battle between prepared meals..."
  response=$(curl -s -X GET "$BASE_URL/battle")
  if echo "$response" | grep -q '"status": "success"'; then
    echo "Battle initiated successfully."
    if [ "$ECHO_JSON" = true ]; then
      echo "Battle Result JSON:"
      echo "$response" | jq .
    fi
  else
    echo "Failed to initiate battle."
    exit 1
  fi
}

clear_combatants() {
  echo "Clearing all combatants..."
  curl -s -X POST "$BASE_URL/clear-combatants" | grep -q '"status": "success"'
}

get_combatants() {
  echo "Getting list of combatants..."
  response=$(curl -s -X GET "$BASE_URL/get-combatants")
  
  if echo "$response" | grep -q '"status": "success"'; then
    echo "Combatants retrieved successfully."
    if [ "$ECHO_JSON" = true ]; then
      echo "Combatants JSON:"
      echo "$response" | jq .
    fi
  else
    echo "Failed to get combatants."
    exit 1
  fi
}

prep_combatant() {
  meal=$1
  echo "Preparing combatant: $meal..."
  response=$(curl -s -X POST "$BASE_URL/prep-combatant" -H "Content-Type: application/json" -d "{\"meal\":\"$meal\"}")
  
  if echo "$response" | grep -q '"status": "success"'; then
    echo "Combatant prepared successfully."
    if [ "$ECHO_JSON" = true ]; then
      echo "Combatants JSON after preparation:"
      echo "$response" | jq .
    fi
  else
    echo "Failed to prepare combatant."
    exit 1
  fi
}


# Leaderboard

get_leaderboard() {
  echo "Getting leaderboard..."
  response=$(curl -s -X GET "$BASE_URL/leaderboard?sort=wins")
  
  if echo "$response" | grep -q '"status": "success"'; then
    echo "Leaderboard retrieved successfully."
    if [ "$ECHO_JSON" = true ]; then
      echo "Leaderboard JSON:"
      echo "$response" | jq .
    fi
  else
    echo "Failed to get leaderboard."
    exit 1
  fi
}


# Run smoketests

# Health checks
check_health
check_db

# Meals management
clear_meals
create_meal "Spaghetti" "Italian" 12.50 "MED"
create_meal "Sushi" "Japanese" 15.00 "HIGH"
get_meal_by_name "Spaghetti"
get_meal_by_id 1
delete_meal_by_id 1
create_meal "Meatball" "Italian" 12.50 "MED"

# Battle preparation
clear_combatants
prep_combatant "Sushi"
prep_combatant "Meatball"
get_combatants
initiate_battle

# Leaderboard
get_leaderboard

echo "All tests passed successfully!"
