// components/FormRow.tsx
import React from "react";
import { Pressable, Text } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  label: string;
  value?: string | null;
  onClick: () => void;
};

export const FormRow: React.FC<Props> = ({
  label,
  value,
  onClick,
}) => {
  const hasValue = !!value;

  return (
    <Pressable
      onPress={onClick}
      style={{
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[200],
        cursor: "pointer",
      }}
    >
      <Text
        style={{
          fontSize: 15,
          color: hasValue
            ? colors.text.secondary
            : colors.text.tertiary,
        }}
      >
        {label}
      </Text>

      {hasValue ? (
        <Text
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: colors.text.primary,
          }}
        >
          {value}
        </Text>
      ) : (
        <Text style={{ color: colors.text.tertiary }}>›</Text>
      )}
    </Pressable>
  );
};