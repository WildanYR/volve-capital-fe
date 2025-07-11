import {
  flexRender,
  type ColumnDef,
  type Table as TanstackTable,
} from '@tanstack/react-table'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table'

type TableDataProps<T> = {
  table: TanstackTable<T>
  columns: ColumnDef<T, any>[]
}

export const TableData = <T,>({ table, columns }: TableDataProps<T>) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Tidak ada data.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
)
