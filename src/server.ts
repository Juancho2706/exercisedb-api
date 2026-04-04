import { serve } from '@hono/node-server'
import { BodyPartController, EquipmentController, ExerciseController, MuscleController } from './modules'
import { App } from './app'

const app = new App([
  new ExerciseController(),
  new MuscleController(),
  new EquipmentController(),
  new BodyPartController()
]).getApp()

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3001
}, (info) => {
  console.log(`\n🚀 Servidor listo en http://localhost:${info.port}`)
})
