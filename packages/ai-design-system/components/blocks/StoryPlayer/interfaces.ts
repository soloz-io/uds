import type { FormEvent, HTMLAttributes, ReactNode } from "react";
import type { TaskItem, TaskQueueProps } from "@/components/composites/TaskQueue";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";

export interface StorySegment {
  id?: string;
  sceneNumber?: number;
  storyNumber?: number;
  segmentNumber?: number;
  totalScenes?: number;
  totalStories?: number;
  totalSegments?: number;
  start_sec?: number;
  duration_sec?: number;
  templateId?: string;
  caption?: string;
  clip_url?: string;
  story_clip_url?: string;
  scene_clip_url?: string;
  video_url?: string;
  scene_audio_clip_url?: string;
  /** Drawn in the primary colour in the segment bar, so the user can find and open it directly. */
  highlighted?: boolean;
  [key: string]: unknown;
}

export type SceneItem = StorySegment;

export type StoryPlaybackMode = "video" | "scenes";

export interface StoryPlayerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  stories?: StorySegment[];
  scenes?: StorySegment[];
  segments?: StorySegment[];
  title?: string;
  initialStoryIndex?: number;
  initialSceneIndex?: number;
  isPlaying?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
  initialMuted?: boolean;
  videoUrl?: string;
  downloadUrl?: string;
  onDownload?: () => void;
  /**
   * Render the full video on request. Offered in the download button's place
   * while there is nothing to download (no `downloadUrl` or `videoUrl`); once
   * there is, the button downloads it.
   */
  onExport?: () => void;
  /** The export cannot start now; `exportDisabledReason` says why. */
  exportDisabled?: boolean;
  exportDisabledReason?: string;
  /** An export is running: the button shows progress and refuses another. */
  isExporting?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  placeholder?: string;
  promptValue?: string;
  onPromptValueChange?: (value: string) => void;
  onSubmit?: (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  onStop?: () => void;
  enableSpeech?: boolean;
  enableAttachments?: boolean;
  onPublish?: (currentStory: StorySegment, text?: string) => void;
  publishPlaceholder?: string;
  onStoryChange?: (storyIndex: number, story: StorySegment) => void;
  onSceneChange?: (sceneIndex: number, scene: StorySegment) => void;
  /** Called when a story/scene segment bar is clicked. Defaults to navigating to that segment via goToStory(idx). */
  onSegmentClick?: (segmentIndex: number, segment: StorySegment) => void;
  onSceneClick?: (sceneIndex: number, scene: StorySegment) => void;
  onOverviewClick?: () => void;
  isOverviewOpen?: boolean;
  overviewBadge?: boolean | number | string;
  commentCount?: number;
  onCommentClick?: () => void;
  isCommentsOpen?: boolean;
  /** Custom slot replacing the default PromptTaskQueue block area. */
  promptSlot?: ReactNode;
  /** Tasks to display in the TaskQueue docked directly above PromptInput. */
  tasks?: TaskItem[];
  /** Custom title for the docked TaskQueue (defaults to e.g. "(n) pending changes"). */
  taskQueueTitle?: string;
  /** Custom action slot rendered on the right side of the TaskQueue header (e.g. Apply button). */
  taskQueueAction?: ReactNode;
  /** Whether the docked TaskQueue is open by default. */
  taskQueueDefaultOpen?: boolean;
  onTaskStop?: (taskId: string) => void;
  onTaskCancel?: (taskId: string) => void;
  onTaskRetry?: (taskId: string) => void;
  onTaskStopAll?: () => void;
  onTaskClick?: (task: TaskItem) => void;
  taskQueueProps?: Partial<Omit<TaskQueueProps, "tasks" | "title" | "action">>;
  showPromptInput?: boolean;
  /** Keeps the prompt visible but refuses sends, e.g. while a change is being made. */
  promptDisabled?: boolean;
  /** The segments are still being fetched: shows a loader instead of the empty state. */
  isLoading?: boolean;
  itemLabel?: string;
  /** Versions of the video the viewer can switch between, newest last. */
  versions?: Array<{ id: string; label?: string }>;
  /** The version playing (the one picked in the switcher). */
  currentVersion?: string;
  onVersionChange?: (versionId: string) => void;
  versionDisabled?: boolean;
  /** The version the video is set to; when another is playing, "Use" offers to switch to it. */
  activeVersion?: string;
  onUseVersion?: (versionId: string) => void;
  useVersionDisabled?: boolean;
  /**
   * How the piece plays: "video" plays `videoUrl` straight through, each segment
   * a span of it (`start_sec`, `duration_sec`); "scenes" plays each segment's own
   * clip in turn. The viewer switches with the icon in the story line.
   * Uncontrolled when omitted, starting at "video".
   */
  playbackMode?: StoryPlaybackMode;
  onPlaybackModeChange?: (mode: StoryPlaybackMode) => void;
  initialPlaybackMode?: StoryPlaybackMode;
  playbackModeDisabled?: boolean;
  playbackModeTooltips?: {
    video?: string;
    scenes?: string;
    disabled?: string;
  };
  renderScene?: (props: {
    index: number;
    scene: StorySegment;
    isPlaying: boolean;
    isMuted?: boolean;
    onEnded?: () => void;
    onProgress?: (progress: number) => void;
  }) => ReactNode;
}

export type ScenePlayerProps = StoryPlayerProps;
