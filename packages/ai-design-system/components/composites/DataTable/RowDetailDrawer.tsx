import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Button } from "@/components/primitives/Button"
import { Icon } from "@/components/primitives/Icon"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/primitives/Chart"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/primitives/Drawer"
import { Input } from "@/components/primitives/Input"
import { Label } from "@/components/primitives/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives/Select"
import { Separator } from "@/components/primitives/Separator"

import type { DashboardRow } from "./table-types"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--secondary)",
  },
} satisfies ChartConfig

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return isMobile
}

export interface RowDetailDrawerProps {
  item: DashboardRow
  onChange: (rowId: number, key: keyof DashboardRow, value: string) => void
}

export function RowDetailDrawer({ item, onChange }: RowDetailDrawerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.header as React.ReactNode}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] sm:max-h-full flex flex-col">
        <DrawerHeader className="gap-1 shrink-0">
          <DrawerTitle>{item.header as React.ReactNode}</DrawerTitle>
          <DrawerDescription>Showing total visitors for the last 6 months</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {open && !isMobile ? (
            <>
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <AreaChart data={chartData} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Area dataKey="mobile" type="natural" fill="var(--color-mobile)" fillOpacity={0.6} stroke="var(--color-mobile)" stackId="a" />
                  <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a" />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month <Icon name="trending-up" size="sm" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This section mirrors the v4 row detail panel.
                </div>
              </div>
              <Separator />
            </>
          ) : null}

          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-3">
              <Label htmlFor="drawer-header">Header</Label>
              <Input id="drawer-header" defaultValue={String(item.header)} onBlur={(e) => onChange(item.id as number, "header", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="drawer-type">Type</Label>
                <Select defaultValue={String(item.type)} onValueChange={(value) => onChange(item.id as number, "type", value)}>
                  <SelectTrigger id="drawer-type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Table of Contents">Table of Contents</SelectItem>
                    <SelectItem value="Executive Summary">Executive Summary</SelectItem>
                    <SelectItem value="Technical Approach">Technical Approach</SelectItem>
                    <SelectItem value="Narrative">Narrative</SelectItem>
                    <SelectItem value="Cover page">Cover page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="drawer-status">Status</Label>
                <Select defaultValue={String(item.status)} onValueChange={(value) => onChange(item.id as number, "status", value)}>
                  <SelectTrigger id="drawer-status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="In Process">In Process</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="drawer-target">Target</Label>
                <Input id="drawer-target" defaultValue={String(item.target)} onBlur={(e) => onChange(item.id as number, "target", e.target.value)} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="drawer-limit">Limit</Label>
                <Input id="drawer-limit" defaultValue={String(item.limit)} onBlur={(e) => onChange(item.id as number, "limit", e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="drawer-reviewer">Reviewer</Label>
              <Select defaultValue={String(item.reviewer)} onValueChange={(value) => onChange(item.id as number, "reviewer", value)}>
                <SelectTrigger id="drawer-reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                  <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                  <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button type="button">Submit</Button>
          <DrawerClose asChild>
            <Button type="button" variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
