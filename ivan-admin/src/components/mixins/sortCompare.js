export const sortCompare = {
  methods: {
    compare (a, b, key) {
      if (key === 'enName') {
        return (a.name.en_first + ' ' + a.name.en_last).localeCompare((b.name.en_first + ' ' + b.name.en_last), undefined, {
          numeric: true
        })
      } else if (key === 'thName') {
        return (a.name.th_first + ' ' + a.name.th_last).localeCompare((b.name.th_first + ' ' + b.name.th_last), undefined, {
          numeric: true
        })
      } else if (key === 'plate_number') {
        return (a.plate_number).localeCompare((b.plate_number), undefined, {
          numeric: true
        })
      } else if (key === 'model') {
        return (a.model).localeCompare((b.model), undefined, {
          numeric: true
        })
      } else if (key === 'serial_number') {
        return (a.serial_number).localeCompare((b.serial_number), undefined, {
          numeric: true
        })
      } else if (key === 'make_date') {
        return (a.make_date).localeCompare((b.make_date), undefined, {
          numeric: true
        })
      }
    },
    compareSchool (a, b, key) {
      if (key === 'enName') {
        return (a.name.en).localeCompare((b.name.en), undefined, {
          numeric: true
        })
      } else if (key === 'thName') {
        return (a.name.th).localeCompare((b.name.th), undefined, {
          numeric: true
        })
      }
    }
  }
}
