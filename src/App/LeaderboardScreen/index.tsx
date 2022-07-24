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
import { DBRow, getScores, getUser } from "../../firebase/firestore";
import { LocationGenerics } from "../../routes";
import StyledLink from "../../shared/StyledLink";

const LeaderboardScreen = () => {
  const { p } = useSearch<LocationGenerics>();
  const page = p ?? 1;
  const [scores, setScores] = useState<DBRow<Score>[]>();
  const [scoresTotal, setScoresTotal] = useState<number>(0);
  const [users, setUsers] = useState<(User | null)[]>();

  useEffect(() => {
    (async () => {
      const [newScores, total] = await getScores(page);
      setScores(newScores);
      setScoresTotal(total);
      setUsers(
        await Promise.all(
          newScores.map((score) => {
            return getUser(score.userId);
          })
        )
      );
    })();
  }, [page]);

  return (
    <Box mt={8} ms={4} me={4}>
      <TableContainer>
        <Table variant="simple" size="sm" colorScheme="gray">
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
                <Tr
                  key={score.createdAt + score.userId}
                  _hover={{ bgColor: "rgba(0,0,0,0.05)" }}
                >
                  <Td>{(page - 1) * 10 + i + 1}</Td>
                  <Td>{users?.[i]?.displayName ?? ""}</Td>
                  <Td>{score.finishTime / 1000}s</Td>
                  <Td>{users?.[i]?.comment ?? ""}</Td>
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
      <Flex mt={2} justifyContent="space-between" userSelect="none">
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
          {...(page < scoresTotal / 10 && page < 10
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
