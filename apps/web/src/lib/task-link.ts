/** Builds an href for `pathname` with the `task` query param set/cleared, preserving all other params (e.g. timeline filters). */
export function buildTaskHref(
  pathname: string,
  searchParams: URLSearchParams,
  taskId: string | null,
): string {
  const params = new URLSearchParams(searchParams);
  if (taskId) {
    params.set("task", taskId);
  } else {
    params.delete("task");
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
