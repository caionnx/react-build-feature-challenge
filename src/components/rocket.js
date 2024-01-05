import { useParams } from "react-router-dom";
import { Watch, Cpu, Loader, Circle, Package, Maximize2 } from "react-feather";
import {
  Flex,
  Heading,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Box,
  Text,
  Spinner,
  Image,
  Stack,
  StatGroup,
} from "@chakra-ui/react";

import { useSpaceXQuery } from "../utils/use-space-x";
import { formatDateTime } from "../utils/format-date";
import Error from "./error";
import Breadcrumbs from "./breadcrumbs";
import FavoriteButton from "./favorite-button";
import { FAVORITES_TYPES } from "../contexts/favorites-context";

const numberFormatter = new Intl.NumberFormat();

export default function Rocket() {
  let { rocketId } = useParams();
  const { data, error } = useSpaceXQuery("rockets", {
    query: { _id: rocketId },
  });
  const rocket = data?.docs[0];

  if (error) return <Error />;
  if (!rocket) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="50vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Rockets", to: "/rockets" },
          { label: `#${rocket.name}` },
        ]}
      />
      <Header rocket={rocket} />
      <Box m={[3, 6]}>
        <Text color="gray.700" fontSize={["md", null, "lg"]} mb="8">
          {rocket.description}
        </Text>
        <TimeAndLocation rocket={rocket} />
        <RocketInfo rocket={rocket} />
        <Gallery images={rocket.flickr_images} />
      </Box>
    </div>
  );
}

function Header({ rocket }) {
  return (
    <Flex
      minHeight="12vh"
      position="relative"
      p={[2, 6]}
      flexDirection={'column'}
    >
      <Flex alignItems="center" mb="8">
        <Heading
          color="white"
          display="inline"
          backgroundColor="#718096b8"
          fontSize={["lg", "5xl"]}
          px="4"
          py="2"
          borderRadius="lg"
        >
          {rocket.name}
        </Heading>
        <FavoriteButton type={FAVORITES_TYPES.ROCKETS} id={rocket.id} width="1.5em" />
      </Flex>
      <Stack isInline spacing="3">
        <Badge colorScheme="purple" fontSize={["xs", "md"]}>
          {rocket.success_rate_pct}% sucess rate
        </Badge>
        {rocket.active ? (
          <Badge colorScheme="green" fontSize={["xs", "md"]}>
            Active
          </Badge>
        ) : (
          <Badge colorScheme="red" fontSize={["xs", "md"]}>
            Retired
          </Badge>
        )}
      </Stack>
    </Flex>
  );
}

function TimeAndLocation({ rocket }) {
  return (
    <SimpleGrid columns={[1, 1, 2]} borderWidth="1px" p="4" borderRadius="md">
      <Stat>
        <StatLabel display="flex">
          <Box as={Watch} width="1em" />{" "}
          <Box ml="2" as="span">
            First flight
          </Box>
        </StatLabel>
        <StatNumber fontSize={["md", "xl"]}>
          {formatDateTime(rocket.first_flight)}
        </StatNumber>
      </Stat>
      <Stat>
        <StatLabel display="flex">
          <Box as={Cpu} width="1em" />{" "}
          <Box ml="2" as="span">
            Engines layout/type
          </Box>
        </StatLabel>
        <StatNumber fontSize={["md", "xl"]}>
          {rocket.engines.layout}/{rocket.engines.type}
        </StatNumber>
      </Stat>
    </SimpleGrid>
  );
}

function RocketInfo({ rocket }) {
  return (
    <SimpleGrid
      columns={[1, 1, 2]}
      borderWidth="1px"
      mt="4"
      p="4"
      borderRadius="md"
    >
      <StatGroup>
        <Stat>
          <StatLabel display="flex">
            <Box as={Maximize2} width="1em" />{" "}
            <Box ml="2" as="span">
              Height
            </Box>
          </StatLabel>
          <StatNumber fontSize={["md", "xl"]}>
            {numberFormatter.format(rocket.height.meters)} m
          </StatNumber>
          <StatHelpText>
            {numberFormatter.format(rocket.height.feet)} ft
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel display="flex">
            <Box as={Package} width="1em" />{" "}
            <Box ml="2" as="span">
              Mass
            </Box>
          </StatLabel>
          <StatNumber fontSize={["md", "xl"]}>
            {numberFormatter.format(rocket.mass.kg)} kg
          </StatNumber>
          <StatHelpText>
            {numberFormatter.format(rocket.mass.lb)} lb.
          </StatHelpText>
        </Stat>   
      </StatGroup>
      <StatGroup>
      <Stat>
          <StatLabel display="flex">
            <Box as={Circle} width="1em" />{" "}
            <Box ml="2" as="span">
              Diameter
            </Box>
          </StatLabel>
          <StatNumber fontSize={["md", "xl"]}>
            {numberFormatter.format(rocket.diameter.meters)} m
          </StatNumber>
          <StatHelpText>
            {numberFormatter.format(rocket.diameter.feet)} ft
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel display="flex">
            <Box as={Loader} width="1em" />{" "}
            <Box ml="2" as="span">
              Landing legs
            </Box>
          </StatLabel>
          <StatNumber fontSize={["md", "xl"]}>
            {rocket.landing_legs.number}
          </StatNumber>
          <StatHelpText>
            {rocket.landing_legs.material}
          </StatHelpText>
        </Stat>
      </StatGroup>
    </SimpleGrid>
  );
}

function Gallery({ images }) {
  return (
    <SimpleGrid my="6" minChildWidth="350px" spacing="4">
      {images.map((src) => (
        <a href={src} key={src}>
          <Image src={src} />
        </a>
      ))}
    </SimpleGrid>
  );
}
