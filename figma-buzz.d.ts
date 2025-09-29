// Buzz and Canvas Grid API Type Definitions for Figma Plugins
//
// Include this file in your plugin project to get TypeScript support for Buzz and Canvas Grid APIs.
//
// Include it in your tsconfig.json's "typeRoots" array as  "./figma-buzz.d.ts"

import "@figma/plugin-typings"

declare global {
  type PluginAPIWithBuzz = Omit<PluginAPI, 'editorType'> & {
    readonly editorType: 'figma' | 'figjam' | 'dev' | 'slides' | 'buzz'
    readonly buzz: BuzzAPI
    getCanvasGrid(): SceneNode[][]
    setCanvasGrid(canvasGrid: SceneNode[][]): void
    createCanvasRow(rowIndex?: number): SceneNode
    moveNodesToCoord(nodeIds: string[], row?: number, col?: number): string[]

    on(type: 'canvasviewchange', callback: (event: CanvasViewChangeEvent) => void): void
    once(type: 'canvasviewchange', callback: (event: CanvasViewChangeEvent) => void): void
    off(type: 'canvasviewchange', callback: (event: CanvasViewChangeEvent) => void): void
  }

  // @ts-expect-error - Override the existing figma declaration
  const figma: PluginAPIWithBuzz

  type BuzzAssetType =
    | 'CUSTOM'
    | 'TWITTER_POST'
    | 'LINKEDIN_POST'
    | 'INSTA_POST_SQUARE'
    | 'INSTA_POST_PORTRAIT'
    | 'INSTA_STORY'
    | 'INSTA_AD'
    | 'FACEBOOK_POST'
    | 'FACEBOOK_COVER_PHOTO'
    | 'FACEBOOK_EVENT_COVER'
    | 'FACEBOOK_AD_PORTRAIT'
    | 'FACEBOOK_AD_SQUARE'
    | 'PINTEREST_AD_PIN'
    | 'TWITTER_BANNER'
    | 'LINKEDIN_POST_SQUARE'
    | 'LINKEDIN_POST_PORTRAIT'
    | 'LINKEDIN_POST_LANDSCAPE'
    | 'LINKEDIN_PROFILE_BANNER'
    | 'LINKEDIN_ARTICLE_BANNER'
    | 'LINKEDIN_AD_LANDSCAPE'
    | 'LINKEDIN_AD_SQUARE'
    | 'LINKEDIN_AD_VERTICAL'
    | 'YOUTUBE_THUMBNAIL'
    | 'YOUTUBE_BANNER'
    | 'YOUTUBE_AD'
    | 'TWITCH_BANNER'
    | 'GOOGLE_LEADERBOARD_AD'
    | 'GOOGLE_LARGE_AD'
    | 'GOOGLE_MED_AD'
    | 'GOOGLE_MOBILE_BANNER_AD'
    | 'GOOGLE_SKYSCRAPER_AD'
    | 'CARD_HORIZONTAL'
    | 'CARD_VERTICAL'
    | 'PRINT_US_LETTER'
    | 'POSTER'
    | 'BANNER_STANDARD'
    | 'BANNER_WIDE'
    | 'BANNER_ULTRAWIDE'
    | 'NAME_TAG_PORTRAIT'
    | 'NAME_TAG_LANDSCAPE'
    | 'INSTA_REEL_COVER'
    | 'ZOOM_BACKGROUND'

  interface BuzzTextField {
    readonly value: string | null
    readonly node: TextNode | null
    setValueAsync(value: string): Promise<void>
  }

  interface BuzzMediaField {
    readonly type: 'IMAGE' | 'VIDEO' | null
    readonly hash: string | null
    readonly node: SceneNode | null
    setMediaAsync(paint: ImagePaint | VideoPaint): Promise<void>
  }

  interface BuzzAPI {
    createFrame(canvasRow?: number, canvasColumn?: number): FrameNode
    createInstance(component: ComponentNode, canvasRow?: number, canvasColumn?: number): InstanceNode
    getBuzzAssetTypeForNode(node: SceneNode): BuzzAssetType | null
    setBuzzAssetTypeForNode(node: SceneNode, assetType: BuzzAssetType): void
    getTextContent(node: SceneNode): BuzzTextField[]
    getMediaContent(node: SceneNode): BuzzMediaField[]
    smartResize(node: SceneNode, width: number, height: number): void
  }

  interface PageNode {
    focusedNode: SceneNode | null
  }

  interface ViewportAPI {
    canvasView?: 'grid' | 'single-asset'
  }
  interface CanvasViewChangeEvent {
    view: 'SINGLE_ASSET' | 'GRID'
  }
}
