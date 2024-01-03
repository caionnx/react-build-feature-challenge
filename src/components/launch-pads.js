import { Badge, Box, SimpleGrid, Text, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import Error from "./error";
import Breadcrumbs from "./breadcrumbs";
import LoadMoreButton from "./load-more-button";
import { useSpaceXPaginatedQuery } from "../utils/use-space-x";
import FavoriteButton from "./favorite-button";
import { FAVORITES_TYPES } from "../contexts/FavoritesContext";

const PAGE_SIZE = 12;

export default function LaunchPads() {
  const { data, error, isValidating, setSize } = useSpaceXPaginatedQuery(
    "launchpads",
    {
      query: { upcoming: false },
      options: {
        limit: PAGE_SIZE,
        populate: ["rockets"],
        sort: { full_name: "asc" },
      },
    }
  );

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Launch Pads" }]}
      />
      <SimpleGrid m={[2, null, 6]} minChildWidth="350px" spacing="4">
        {error && <Error />}
        {data
          ?.map((page) => page.docs)
          .flat()
          .map((launchPad) => (
            <LaunchPadItem key={launchPad.id} launchPad={launchPad} />
          ))}
      </SimpleGrid>
      <LoadMoreButton
        loadMore={() => setSize((size) => size + 1)}
        data={data}
        pageSize={PAGE_SIZE}
        isLoadingMore={isValidating}
      />
    </div>
  );
}

function LaunchPadItem({ launchPad }) {
  return (
    <Box
      as={Link}
      to={`/launch-pads/${launchPad.id}`}
      boxShadow="md"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      position="relative"
    >
      <Box p="6">
        <Flex gap="6" alignItems="center" justifyContent="space-between">
          <Box minW="0">
            <Box d="flex" alignItems="baseline">
              {launchPad.status === "active" ? (
                <Badge px="2" variant="solid" colorScheme="green">
                  Active
                </Badge>
              ) : (
                <Badge px="2" variant="solid" colorScheme="red">
                  Retired
                </Badge>
              )}
              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="2"
                isTruncated
              >
                {launchPad.launch_attempts} attempted &bull;{" "}
                {launchPad.launch_successes} succeeded
              </Box>
            </Box>

            <Box
              mt="1"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              {launchPad.full_name}
            </Box>
          </Box>
          <Box>
            <FavoriteButton type={FAVORITES_TYPES.PADS} id={launchPad.id} />
          </Box>
        </Flex>
        
        <Text color="gray.500" fontSize="sm">
          {launchPad.rockets.map((r) => r.name).join(", ")}
        </Text>
      </Box>
    </Box>
  );
}
