import { Badge, Box, Image, SimpleGrid, Text, Flex, Tooltip } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useSpaceXPaginatedQuery } from "../utils/use-space-x";
import { formatDate } from "../utils/format-date";
import Error from "./error";
import Breadcrumbs from "./breadcrumbs";
import LoadMoreButton from "./load-more-button";
import FavoriteButton from "./favorite-button";
import { FAVORITES_TYPES } from "../contexts/favorites-context";

const PAGE_SIZE = 12;

export default function Rockets() {
  const { data, error, isValidating, setSize } = useSpaceXPaginatedQuery(
    "rockets",
    {
      query: {},
      options: {
        limit: PAGE_SIZE,
        sort: { full_name: "asc" },
      },
    }
  );

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Rockets" }]}
      />
      <SimpleGrid m={[2, null, 6]} minChildWidth="350px" spacing="4">
        {error && <Error />}
        {data
          ?.map((page) => page.docs)
          .flat()
          .map((rocket) => (
            <RocketItem rocket={rocket} key={rocket.id} />
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

export function RocketItem({ rocket }) {
  return (
    <Box
      as={Link}
      to={`/rockets/${rocket.id}`}
      boxShadow="md"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      position="relative"
    >
      <Image
        src={rocket.flickr_images[0]}
        alt={`${rocket.name} rocket`}
        height={["200px", null, "300px"]}
        width="100%"
        objectFit="cover"
        objectPosition="bottom"
      />

      <Box p="6">
        <Flex gap="1" alignItems="center" justifyContent="space-between">
          <Box minW="0">
            <Box d="flex" alignItems="baseline">
              {rocket.active ? (
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
                {rocket.success_rate_pct}% success rate
              </Box>
            </Box>

            <Box
              mt="1"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              {rocket.name}
            </Box>
          </Box>
          <Box>
            <FavoriteButton id={rocket.id} type={FAVORITES_TYPES.ROCKETS} />
          </Box>
        </Flex>
        <Flex>
        <Tooltip label="First flight">
          <Text fontSize="sm">{formatDate(rocket.first_flight)}</Text>
        </Tooltip>
        </Flex>
      </Box>
    </Box>
  );
}
