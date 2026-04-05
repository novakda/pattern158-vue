<script setup lang="ts">
import { ref } from 'vue'

interface Shape {
  type: 'rect' | 'arrow'
  startX: number
  startY: number
  endX: number
  endY: number
}

const props = defineProps<{
  screenshotSrc: string
}>()

const activeTool = ref<'rect' | 'arrow'>('rect')
const shapes = ref<Shape[]>([])
const drawing = ref(false)
const currentShape = ref<Shape | null>(null)

const imgRef = ref<HTMLImageElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let renderedWidth = 0
let renderedHeight = 0

function onImageLoad() {
  const img = imgRef.value
  const canvas = canvasRef.value
  if (!img || !canvas) return

  renderedWidth = img.offsetWidth
  renderedHeight = img.offsetHeight
  canvas.width = renderedWidth
  canvas.height = renderedHeight
}

function onMouseDown(e: MouseEvent) {
  drawing.value = true
  currentShape.value = {
    type: activeTool.value,
    startX: e.offsetX,
    startY: e.offsetY,
    endX: e.offsetX,
    endY: e.offsetY,
  }
}

function onMouseMove(e: MouseEvent) {
  if (!drawing.value || !currentShape.value) return
  currentShape.value.endX = e.offsetX
  currentShape.value.endY = e.offsetY
  redraw()
}

function onMouseUp(e: MouseEvent) {
  if (!drawing.value || !currentShape.value) return
  currentShape.value.endX = e.offsetX
  currentShape.value.endY = e.offsetY

  const dx = Math.abs(currentShape.value.endX - currentShape.value.startX)
  const dy = Math.abs(currentShape.value.endY - currentShape.value.startY)
  if (dx + dy > 5) {
    shapes.value.push({ ...currentShape.value })
  }

  drawing.value = false
  currentShape.value = null
  redraw()
}

function undo() {
  shapes.value.pop()
  redraw()
}

function drawShapeOnCtx(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  scaleX: number,
  scaleY: number,
  lineScale: number,
) {
  ctx.strokeStyle = '#ff3333'
  ctx.lineWidth = 2 * lineScale
  ctx.lineCap = 'round'

  const sx = shape.startX * scaleX
  const sy = shape.startY * scaleY
  const ex = shape.endX * scaleX
  const ey = shape.endY * scaleY

  if (shape.type === 'rect') {
    ctx.strokeRect(sx, sy, ex - sx, ey - sy)
  } else {
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(ex, ey)
    ctx.stroke()

    // Arrowhead
    const angle = Math.atan2(ey - sy, ex - sx)
    const headLen = 12 * lineScale

    ctx.beginPath()
    ctx.moveTo(ex, ey)
    ctx.lineTo(
      ex + headLen * Math.cos(angle + Math.PI * 5 / 6),
      ey + headLen * Math.sin(angle + Math.PI * 5 / 6),
    )
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(ex, ey)
    ctx.lineTo(
      ex + headLen * Math.cos(angle - Math.PI * 5 / 6),
      ey + headLen * Math.sin(angle - Math.PI * 5 / 6),
    )
    ctx.stroke()
  }
}

function redraw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const shape of shapes.value) {
    drawShapeOnCtx(ctx, shape, 1, 1, 1)
  }
  if (currentShape.value) {
    drawShapeOnCtx(ctx, currentShape.value, 1, 1, 1)
  }
}

function compositeScreenshot(): string {
  const img = imgRef.value
  if (!img) return props.screenshotSrc

  const natW = img.naturalWidth
  const natH = img.naturalHeight

  const offscreen = document.createElement('canvas')
  offscreen.width = natW
  offscreen.height = natH
  const ctx = offscreen.getContext('2d')
  if (!ctx) return props.screenshotSrc

  ctx.drawImage(img, 0, 0)

  const scaleX = natW / renderedWidth
  const scaleY = natH / renderedHeight
  const lineScale = Math.max(scaleX, scaleY)

  for (const shape of shapes.value) {
    drawShapeOnCtx(ctx, shape, scaleX, scaleY, lineScale)
  }

  return offscreen.toDataURL('image/png')
}

defineExpose({ compositeScreenshot })
</script>

<template>
  <div class="fb-annotation">
    <div class="fb-annotation-toolbar">
      <button
        :class="['fb-annotation-tool', { 'fb-annotation-tool--active': activeTool === 'rect' }]"
        @click="activeTool = 'rect'"
        title="Rectangle"
      >&#9633;</button>
      <button
        :class="['fb-annotation-tool', { 'fb-annotation-tool--active': activeTool === 'arrow' }]"
        @click="activeTool = 'arrow'"
        title="Arrow"
      >&#8599;</button>
      <button
        class="fb-annotation-tool"
        @click="undo"
        :disabled="shapes.length === 0"
        title="Undo"
      >&#8630;</button>
    </div>
    <div class="fb-annotation-canvas-wrap">
      <img
        :src="screenshotSrc"
        class="fb-annotation-img"
        ref="imgRef"
        @load="onImageLoad"
        draggable="false"
      />
      <canvas
        ref="canvasRef"
        class="fb-annotation-canvas"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      />
    </div>
  </div>
</template>
