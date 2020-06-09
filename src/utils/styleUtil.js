export default{
  getStyle (device) {
    return device.TYPE === 4 ? (device.Warning_state > 0 ? 9 : 8)
      : device.TYPE === 1 ? 3
        : device.STATE === 0 ? 4
          : device.Warning_state > 0 ? 2
            : device.Power < 5 ? 1
              : device.Power < 50 ? 7 // 6
                : device.Power < 100 ? 7
                  : ((device.FirDimming || 0) >= 10 || (device.SecDimming || 0) >= 10 || device.Power) ? 0
                    : 1
  }
}
