export const NodePlaceholder = () => {
  return (
    <>
      <div
        contentEditable={false}
        className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-inherit opacity-0 in-[.has-focus]:opacity-60"
      >
        <span>Type</span>
        <kbd className="inline-flex items-center justify-center rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-muted-foreground">
          /
        </kbd>
        <span>to add blocks</span>
      </div>
    </>
  );
};
