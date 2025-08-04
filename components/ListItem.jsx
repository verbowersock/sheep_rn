import { ScrollView, View, TouchableOpacity } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import { uiSelector } from "../store/slices/ui";

const ListItem = ({
  index,
  item,
  selectedValue,
  showContextMenu,
  onItemPress,
  onPlusPress,
  onListPress,
}) => {
  const { contextMenuOpen } = useSelector(uiSelector);
  const theme = useTheme();
  return (
    <View
      style={{
        width:
          selectedValue === "misc" || selectedValue === "health"
            ? "100%"
            : "50%",
        paddingBottom: 6,
        paddingLeft: 20,
        paddingRight: 20,
        maxHeight: item.title === "Notes" ? "80%" : 200,
      }}
    >
      {showContextMenu ? (
        <View>
          <TouchableOpacity onPress={onItemPress}>
            <Item item={item}></Item>
          </TouchableOpacity>
          {contextMenuOpen[index] === true && (
            <View style={{ flexDirection: "row" }}>
              <View>
                <IconButton
                  onPress={onListPress}
                  iconColor={theme.colors.primary}
                  icon="clipboard-list-outline"
                ></IconButton>
              </View>
              <View>
                <IconButton
                  onPress={onPlusPress}
                  iconColor={theme.colors.primary}
                  icon="plus-circle-outline"
                ></IconButton>
              </View>
            </View>
          )}
        </View>
      ) : (
        <Item item={item}></Item>
      )}
    </View>
  );
};

const Item = ({ item }) => {
  return (
    <>
      <Text style={{ fontSize: 17, fontWeight: "bold" }}>{item.title} </Text>
      <ScrollView
        style={{
          borderColor: item.title === "Notes" ? "#ebedf0" : "white",
          borderWidth: 1,
          padding: item.title === "Notes" ? 20 : 0,
        }}
      >
        <Text style={{ fontSize: 17 }}>{item.description}</Text>
      </ScrollView>
    </>
  );
};

export default ListItem;
