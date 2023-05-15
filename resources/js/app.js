// app entrypoint
import '../css/app.css'
import { getTimeZones } from '@vvo/tzdb'
import Alpine from 'alpinejs'
// import * as Turbo from '@hotwired/turbo'
import { DateTime } from 'luxon'
// window.Turbo = Turbo

// Turbo.setProgressBarDelay(10)

document.addEventListener('alpine:init', () => {
  Alpine.data('timezoneChunk', () => ({
    tzNames: [],
    selectedTZ: '',
    async init() {
      const d = getTimeZones()

      this.tzNames = d
        .map(x => {
          return {
            value: x.name,
            label:
              DateTime.now().setZone(x.name).toFormat('ZZZZZ') + ` (${x.name})`,
          }
        })
        .sort((x, y) => String(x.value).localeCompare(y.value))
      const localGuess = DateTime.now().zoneName
      this.selectedTZ = localGuess
    },
  }))
})

Alpine.start()
