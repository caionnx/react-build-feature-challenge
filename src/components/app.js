import { Routes, Route } from "react-router-dom";
import { useRef } from 'react';
import {
  Flex,
  Text,
  Button,
  useDisclosure
} from "@chakra-ui/react";

import { FavoritesProvider } from "../contexts/favorites-context";
import Launches from "./launches";
import Launch from "./launch";
import Home from "./home";
import LaunchPads from "./launch-pads";
import LaunchPad from "./launch-pad";
import Rockets from "./rockets";
import Rocket from "./rocket";
import FavoriteDrawer from "./favorite-drawer";

export default function App() {
  return (
    <div>
      <FavoritesProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/launches" element={<Launches />} />
          <Route path="/launches/:launchId" element={<Launch />} />
          <Route path="/launch-pads" element={<LaunchPads />} />
          <Route path="/launch-pads/:launchPadId" element={<LaunchPad />} />
          <Route path="/rockets" element={<Rockets />} />
          <Route path="/rockets/:rocketId" element={<Rocket />} />
        </Routes>
      </FavoritesProvider>
    </div>
  );
}

function NavBar() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="6"
      bg="gray.800"
      color="white"
    >
      <Text
        fontFamily="mono"
        letterSpacing="2px"
        fontWeight="bold"
        fontSize="lg"
      >
        ¡SPACE·R0CKETS!
      </Text>
      <FavoriteDrawerTrigger />
    </Flex>
  );
}


function FavoriteDrawerTrigger() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  return (
    <>
      <Button size="sm" color="gray.800" ref={btnRef} onClick={onOpen}>
        My Favorites
      </Button>
      <FavoriteDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
    </>
  )
}