
# Pagination
def edges_to_return(
        all_edges=None, before=None, after=None, first=None, last=None
):
    edges = apply_cursors_to_edges(all_edges, before, after)
    if first is not None:
        if first < 0:
            raise ValueError("First must be greater than 0")
        if len(edges) > first:
            edges = edges[:first]
    if last is not None:
        if last < 0:
            raise ValueError("Last must be greater than 0")
        edges_len = len(edges)
        if edges_len > last:
            edges = edges[edges_len - last:]
    return edges


def apply_cursors_to_edges(all_edges=None, before=None, after=None):
    edges = all_edges
    pos = 1  # slicing stops at pos - 1
    if after is not None:
        for e in edges:
            if e['cursor'] == after:
                edges = edges[pos:]
            else:
                pos += 1
    pos = 1  # reset
    if before is not None:
        for e in edges:
            if e['cursor'] == before:
                edges = edges[:pos]
            else:
                pos += 1
    return edges


#  PageInfo
def has_previous_page(
    all_edges=None,
    before=None,
    after=None,
    first=None,
    last=None
):
    if last is not None:
        edges = apply_cursors_to_edges(all_edges, before, after)
        if len(edges) > last:
            return True
        else:
            return False
    if after is not None:
        pass
        # if we can find elements before after, return true
    return False


def has_next_page(
    all_edges=None,
    before=None,
    after=None,
    first=None,
    last=None
):
    if first is not None:
        edges = apply_cursors_to_edges(all_edges, before, after)
        if len(edges) > first:
            return True
        else:
            return False
    if before is not None:
        pass
        # if we can find elements following before, return true
    return False


def make_connection(models, before, after, first, last):
    total_count = len(models)
    all_edges = list(map(lambda c: ({'node': c, 'cursor': str(c.id)}), models))
    edges = edges_to_return(all_edges, before, after, first, last)

    if not edges or not edges[0]:
        start_cursor = 0,
        end_cursor = 0
    else:
        start_cursor = edges[0]['cursor'],
        end_cursor = edges[len(edges) - 1]['cursor']

    page_info = {
        "has_previous_page": has_previous_page(
            all_edges,
            before,
            after,
            first,
            last
        ),
        "has_next_page": has_next_page(all_edges, before, after, first, last),
        "start_cursor": start_cursor,
        "end_cursor": end_cursor
    }

    connection = {
        "page_info": page_info,
        "total_count": total_count,
        "edges": edges
    }

    return connection
