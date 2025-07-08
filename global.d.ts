declare module 'three/examples/jsm/loaders/BVHLoader' {
  import { Loader, AnimationClip, Skeleton } from 'three'

  export class BVHLoader extends Loader<BVHResult> {
    parse(bvhText: string) {
      throw new Error('Method not implemented.')
    }
    load(
      url: string,
      onLoad: (result: BVHResult) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void
  }

  export interface BVHResult {
    skeleton: Skeleton
    clip: AnimationClip
  }
}
