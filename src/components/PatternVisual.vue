<template>
  <div class="pattern-visual">
    <div class="pattern-bar"></div>
    <div class="pattern-bar"></div>
    <div class="pattern-bar"></div>
  </div>
</template>

<style scoped>
.pattern-visual {
    margin: var(--space-xl) auto;
    width: 200px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: var(--space-sm);
}

.pattern-bar {
    background: var(--color-primary);
    width: 30px;
    opacity: 0.8;
    transition: all 0.3s;
}

.pattern-bar:nth-child(1) { height: 10px; }
.pattern-bar:nth-child(2) { height: 50px; }
.pattern-bar:nth-child(3) { height: 80px; }

.pattern-visual:hover .pattern-bar {
    opacity: 1;
    transform: scaleY(1.1);
}
</style>
