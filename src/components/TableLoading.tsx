import { Skeleton } from './ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

export const TableLoading = () => (
  <div className="p-4 space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: 4 }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-6 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 4 }).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
)
