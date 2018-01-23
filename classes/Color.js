class Color {
  average(color) {
    let total = 0;
    for (let i = 0; i < color.length; i += 1) {
      total += color[i] * color[i];
    }
    const divide = total / color.length;
    const squareRoot = Math.sqrt(divide);
    return Math.round(squareRoot);
  }

  averageRgbs(colors) {
    const reds = [];
    const greens = [];
    const blues = [];
    for (let i = 0; i < colors.length; i += 1) {
      reds.push(colors[i][0]);
      greens.push(colors[i][1]);
      blues.push(colors[i][2]);
    }

    const averageColor = [this.average(reds), this.average(greens), this.average(blues)];
    return averageColor;
  }
}

module.exports = Color;