interface Connection<T> {
  totalCount: number;
  pageInfo: {
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: {
    node: T;
    cursor: string;
  }[];
}

export default function edgesToNodes<T>(
  data: Connection<T> | undefined, currentPage: number, patientsPerPage: number,
) {
  const pageCount = data
    ? Math.ceil(data.totalCount / patientsPerPage)
    : 0;

  const allNodes = data?.edges?.map((edge) => edge?.node);
  const pageInfo = data?.pageInfo;

  const start = currentPage * patientsPerPage;
  const end = start + patientsPerPage;
  const nodes = allNodes?.slice(start, end);

  return { nodes, pageCount, pageInfo };
}
