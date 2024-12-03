<template>
  <div className="h-full flex flex-col items-center justify-center text-center p-4">
    <span class="animate-spin inline-block border-current border-t-transparent text-gray-700 rounded-full size-8 border-[4px] " role="status" aria-label="loading">
      <span class="sr-only">Loading...</span>
    </span>
    <h2 className="text-2xl font-bold text-gray-700 mb-2">Cargando...</h2>
    <p className="text-gray-500">
      Estamos preparando el contenido para ti. Esto solo tomará un momento.
    </p>
  </div>
</template>
