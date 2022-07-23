import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useSearch } from "@tanstack/react-location";
import { useEffect, useState } from "react";
import { DBRow, getScores } from "../../firebase/firestore";
import { LocationGenerics } from "../../routes";
import StyledLink from "../../shared/StyledLink";

const LeaderboardScreen = () => {
  const { p } = useSearch<LocationGenerics>();
  const page = p ?? 1;
  const [scores, setScores] = useState<DBRow<Score>[]>();

  useEffect(() => {
    (async () => {
      setScores(await getScores(page));
    })();
  }, [page]);

  return (
    <Box mt={8} ms={4} me={4}>
      <TableContainer>
        <Table variant="striped" size="sm" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Player</Th>
              <Th>Time</Th>
              <Th isNumeric>Comment</Th>
            </Tr>
          </Thead>
          <Tbody>
            {scores && scores.length !== 0 ? (
              scores.map((score, i) => (
                <Tr key={score.createdAt + score.userId}>
                  <Td>{(page - 1) * 10 + i + 1}</Td>
                  <Td>{score.userId}</Td>
                  <Td>{score.finishTime / 1000}s</Td>
                  <Td isNumeric>user.comment</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4}>No entries</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justifyContent="space-between">
        <StyledLink
          replace={true}
          {...(page !== 1
            ? {
                search: { p: page - 1 },
              }
            : { disabled: true, color: "gray.300" })}
        >
          <ArrowLeftIcon />
        </StyledLink>
        <StyledLink
          replace={true}
          {...(page !== 10
            ? {
                search: { p: page + 1 },
              }
            : { disabled: true, color: "gray.300" })}
        >
          <ArrowRightIcon />
        </StyledLink>
      </Flex>
    </Box>
  );
};

export default LeaderboardScreen;
