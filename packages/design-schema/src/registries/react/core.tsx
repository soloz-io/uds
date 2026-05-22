"use client";

import { defineRegistry } from "@json-render/react";
import { shadcnComponents } from "@json-render/shadcn";
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

import { coreSchemas } from "../../schemas/core/index.js";

/**
 * Core registry — wires shadcn primitives to ai-design-system layout + form components.
 * Delegates to @json-render/shadcn for components that are identical to generic shadcn.
 */
const coreCatalog = defineCatalog(schema, {
  components: coreSchemas as Parameters<typeof defineCatalog>[1]["components"],
  actions: {},
});

export const { registry: coreRegistry } = defineRegistry(coreCatalog, {
  components: {
    // --- Delegate to @json-render/shadcn implementations ---
    Stack: shadcnComponents.Stack,
    Grid: shadcnComponents.Grid,
    Card: shadcnComponents.Card,
    Separator: shadcnComponents.Separator,
    Heading: shadcnComponents.Heading,
    Text: shadcnComponents.Text,

    Button: shadcnComponents.Button,
    Input: shadcnComponents.Input,
    Form: shadcnComponents.Form,
    Select: shadcnComponents.Select,
    Checkbox: shadcnComponents.Checkbox,
    Switch: shadcnComponents.Switch,
    Textarea: shadcnComponents.Textarea,
    RadioGroup: shadcnComponents.RadioGroup,

    Badge: shadcnComponents.Badge,
    Alert: shadcnComponents.Alert,
    Progress: shadcnComponents.Progress,
    Skeleton: shadcnComponents.Skeleton,
    Spinner: shadcnComponents.Spinner,

    Tabs: shadcnComponents.Tabs,
    TabContent: shadcnComponents.TabContent,
    Pagination: shadcnComponents.Pagination,

    Dialog: shadcnComponents.Dialog,
    Drawer: shadcnComponents.Drawer,
    DropdownMenu: shadcnComponents.DropdownMenu,
    Tooltip: shadcnComponents.Tooltip,
    Popover: shadcnComponents.Popover,
    Avatar: shadcnComponents.Avatar,
    Label: shadcnComponents.Label,
    Accordion: shadcnComponents.Accordion,
    AccordionItem: shadcnComponents.AccordionItem,
  },
});

export { coreCatalog };
