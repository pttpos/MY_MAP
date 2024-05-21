import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

interface FilterFormProps {
  onClose: () => void;
  onSubmit: (filterValue: string) => void; // Add onSubmit prop
}

const FilterForm: React.FC<FilterFormProps> = ({ onClose, onSubmit }) => {
  const [filterValue, setFilterValue] = useState("");

  const handleSubmit = () => {
    onSubmit(filterValue); // Call onSubmit prop with filter value
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Form</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter filter value"
        value={filterValue}
        onChangeText={(text) => setFilterValue(text)}
      />
      <Button title="Apply Filter" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 120,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default FilterForm;
