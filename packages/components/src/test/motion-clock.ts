import { MotionGlobalConfig, cancelFrame, frame, frameData, time } from 'motion/react'

/** One frame at 60Hz, the same step motion assumes when it has no elapsed time to go on. */
const FRAME_MS = 1000 / 60

/**
 * Motion advances its animations off `performance.now()`, so "where has this tween got to
 * after one frame" is really a question about how fast the machine is. On a loaded CI
 * runner a frame can span the whole animation, and an assertion about a value mid-flight
 * fails on a component that is working correctly.
 *
 * Manual timing swaps the wall clock for one this file owns. Each batch advances by a
 * fixed step, so a given number of frames always covers the same amount of animation
 * whatever else the machine is doing, and a tween's progress becomes a function of how
 * many times the test pumped the loop rather than of how long that took.
 */
export function installMotionClock() {
  MotionGlobalConfig.useManualTiming = true
  frameData.timestamp = 0
  frameData.delta = FRAME_MS
  time.set(0)

  // `setup` is the first step of the batch, so the rest of the frame — including every
  // animation's update — reads the time this advanced it to.
  const advance = () => {
    frameData.timestamp += FRAME_MS
    frameData.delta = FRAME_MS
    time.set(frameData.timestamp)
  }

  frame.setup(advance, true)

  return () => {
    cancelFrame(advance)
    MotionGlobalConfig.useManualTiming = false
  }
}
