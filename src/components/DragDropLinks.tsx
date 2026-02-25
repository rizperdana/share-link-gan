"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Link as LinkType } from "@/lib/types";

interface DragDropLinksProps {
  links: LinkType[];
  onReorder: (reordered: LinkType[]) => void;
  onEdit: (link: LinkType) => void;
  onDelete: (id: string) => void;
  onToggle: (link: LinkType) => void;
}

function SortableLink({
  link,
  onEdit,
  onDelete,
  onToggle,
}: {
  link: LinkType;
  onEdit: (link: LinkType) => void;
  onDelete: (id: string) => void;
  onToggle: (link: LinkType) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : ("auto" as any),
  };

  const isScheduled = link.scheduled_start || link.scheduled_end;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`link-item ${!link.is_active ? "link-item-inactive" : ""}`}
    >
      {/* Drag Handle */}
      <button
        className="drag-handle"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      </button>

      <span className="link-item-icon">{link.icon}</span>

      <div className="link-item-content">
        <div className="link-item-title">
          {link.title}
          {link.is_private && (
            <span className="link-badge link-badge-private" title="Private">
              🔒
            </span>
          )}
          {isScheduled && (
            <span className="link-badge link-badge-scheduled" title="Scheduled">
              ⏰
            </span>
          )}
        </div>
        <div className="link-item-url">{link.url}</div>
        {link.tags && link.tags.length > 0 && (
          <div className="link-tags">
            {link.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="link-item-actions">
        <label className="toggle" title="Toggle active">
          <input
            type="checkbox"
            checked={link.is_active || false}
            onChange={() => onToggle(link)}
          />
          <span className="toggle-slider" />
        </label>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(link)}
          title="Edit"
        >
          ✏️
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(link.id)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default function DragDropLinks({
  links,
  onReorder,
  onEdit,
  onDelete,
  onToggle,
}: DragDropLinksProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex).map((l, i) => ({
      ...l,
      sort_order: i,
    }));
    onReorder(reordered);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={links.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="link-list">
          {links.map((link) => (
            <SortableLink
              key={link.id}
              link={link}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
