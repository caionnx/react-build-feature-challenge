import { Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  Flex,
  HStack,
  Spinner,
  Button,
  Image,
  Box,
  Heading,
  Text,
  Divider,
} from "@chakra-ui/react";
import { format as timeAgo } from "timeago.js";
import { Link } from "react-router-dom";

import { FAVORITES_TYPES, useFavoritesContext } from "../contexts/favorites-context";
import { useSpaceXQuery } from "../utils/use-space-x";
import Error from "./error";

export default function FavoriteDrawer({
  isOpen,
  onClose,
  btnRef
}) {
  const { favoriteItems } = useFavoritesContext();

  if(!favoriteItems[FAVORITES_TYPES.LAUNCHES].length && !favoriteItems[FAVORITES_TYPES.PADS].length) {
    return (
      <DrawerWrapper isOpen={isOpen} onClose={onClose} btnRef={btnRef}>
        Empty list, how about adding to favorites?
        <Stack marginTop="4" direction="column">
          <Button onClick={onClose} variant='outline' as={Link} to="/launches">Browse Launches</Button>
          <Button onClick={onClose} variant='outline' as={Link} to="/launch-pads">Browse Launch Pads</Button>
        </Stack>
      </DrawerWrapper>
    );
  }

  return (
    <DrawerWrapper isOpen={isOpen} onClose={onClose} btnRef={btnRef}>
      {
        !!favoriteItems[FAVORITES_TYPES.LAUNCHES].length && <>
          <FavoriteLaunches onCloseDrawer={onClose} launchesIds={favoriteItems[FAVORITES_TYPES.LAUNCHES]} />
        </>
      }
      <Divider mb="8" mt="8" />
      {
        !!favoriteItems[FAVORITES_TYPES.PADS].length && <>
          <FavoritePads onCloseDrawer={onClose} padsIds={favoriteItems[FAVORITES_TYPES.PADS]} />
        </>
      }
    </DrawerWrapper>
  );
};

function FavoritePads({ padsIds, onCloseDrawer }) {
  const { data, error } = useSpaceXQuery("launchpads", {
    query: { _id: padsIds },
    options: { populate: ["rockets"] },
  });

  const pads = data?.docs;

  if (error) return <Error />;
  if (!pads || !pads.length) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="5vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return <>
    <Heading fontSize="lg" mb="4">
      Launch Pads
    </Heading>
    <Stack spacing={4} direction='column'>
      {
        pads.map(launchPad => <FavoritePadsItem key={launchPad.id} onCloseDrawer={onCloseDrawer} launchPad={launchPad} />)
      }
    </Stack>
  </>
}

function FavoritePadsItem({ launchPad, onCloseDrawer }) {
  return <HStack flexWrap={{ base: "wrap", sm: "nowrap"}} spacing={{ base: '0', sm: '6' }} wrap="wrap" key={launchPad.id} p={5} shadow='md' borderWidth='1px'>
    <Box p="0.5" isTruncated>
      <Heading isTruncated fontSize='lg'>{launchPad.full_name}</Heading>
      <Text mb="4">{launchPad.rockets.map((r) => r.name).join(", ")}</Text>
      <Button onClick={onCloseDrawer} as={Link} to={`/launch-pads/${launchPad.id}`} variant='outline' colorScheme='gray'>
        Launch Pad Details
      </Button>
    </Box>
  </HStack>
}

function FavoriteLaunches({ launchesIds, onCloseDrawer }) {
  const { data, error } = useSpaceXQuery("launches", {
    query: { _id: launchesIds },
  });

  const launches = data?.docs;

  if (error) return <Error />;
  if (!launches || !launches.length) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="5vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return <>
    <Heading fontSize="lg" mb="4">
      Launches
    </Heading>
    <Stack spacing={4} direction='column'>
      {
        launches.map(launch => <FavoriteLaunchesItem key={launch.id} onCloseDrawer={onCloseDrawer} launch={launch} />)
      }
    </Stack>
  </>
}

function FavoriteLaunchesItem({ launch, onCloseDrawer }) {
  return <HStack flexWrap={{ base: "wrap", sm: "nowrap"}} spacing={{ base: '0', sm: '6' }} wrap="wrap" key={launch.id} p={5} shadow='md' borderWidth='1px'>
    <Image
      objectFit='cover'
      boxSize={{ base: '100%', sm: '100px'}}
      maxH={{ base: '150px', sm: 'auto' }}
      marginBottom={{ base: '6', sm: '0' }}
      src={launch.links.flickr.original[0] ?? launch.links.patch.small}
      alt={`${launch.name} launch`}
    />
    <Box p="0.5" isTruncated>
      <Heading isTruncated fontSize='lg'>{launch.name} #{launch.flight_number}</Heading>
      <Text mb="4">{timeAgo(launch.date_utc)}</Text>
      <Button onClick={onCloseDrawer} as={Link} to={`/launches/${launch.id}`} variant='outline' colorScheme='gray'>
        Launch Details
      </Button>
    </Box>
  </HStack>
}

function DrawerWrapper({
  isOpen,
  onClose,
  btnRef,
  children
}) {
  return <>
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      finalFocusRef={btnRef}
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>My Favorites</DrawerHeader>

        <DrawerBody>
          {children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  </>
}