import { Stack } from "@mui/material";
import React, { FC } from "react";
import { layoutStyles } from "./layout.styles";
import { IMainLayout } from "./layout.types";
import MainMenu from "../ui/menu/menu";

const MainLayout: FC<IMainLayout> = ({ children }) => {
  return (
    <Stack sx={layoutStyles.mainLayoutContainerSx()}>
      <Stack sx={layoutStyles.layoutContentSx()}>
        {children}
        <MainMenu />
      </Stack>
    </Stack>
  );
};

export default MainLayout;