import { getDimensions, PAPER_TYPES } from './battery-config.js';

export function createTemplate(image, batteryType, columns, rows, showGuides, scaleToFit, paperType, includeOverlap) { 
    return new Promise((resolve, reject) => {
        var { widthPx: wrapWidth, heightPx: wrapHeight } = getDimensions(batteryType);
        console.log(wrapHeight, includeOverlap)
        wrapHeight += includeOverlap ? wrapHeight * 0.125 : 0
        console.log(wrapHeight)
    
        const paperSize = PAPER_TYPES[paperType]
        const maxCols = Math.floor(paperSize.widthPx / wrapWidth);
        const maxRows = Math.floor(paperSize.heightPx / wrapHeight);

        if (columns > maxCols || rows > maxRows) {
            reject(`Max allowed: ${maxCols} columns, ${maxRows} rows`);
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = paperSize.widthPx;
        canvas.height = paperSize.heightPx;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const gridWidth = columns * (wrapWidth);
        const gridHeight = rows * (wrapHeight);
        const startX = (paperSize.widthPx - gridWidth)// / 2;
        const startY = (paperSize.heightPx - gridHeight)// / 2;
        const padX = (startX)//columns
        const padY = (startY)//rows

        for (let col = 0; col < columns; col++) {
            for (let row = 0; row < rows; row++) {
              var x = startX + col * wrapWidth// - (padX*columns);
              var y = startY + row * wrapHeight// - (padY*rows);
              x -= (padX*0.95)
              x += col>0 ? (col*(padX/(columns-1)*0.9)) : 0
              y -= (padY*0.95)
              y += row>0 ? (row*(padY/(rows-1))*0.9) : 0
          
              ctx.save();
          
              ctx.beginPath();
              ctx.rect(x, y, wrapWidth, wrapHeight);
              ctx.clip();
          
              drawScaledImage(ctx, image, x, y, wrapWidth, wrapHeight, scaleToFit);
              ctx.restore();
          
              if (showGuides) {
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.strokeRect(x - 1, y - 1, wrapWidth + 2, wrapHeight + 2);
              }
            }
          }

        resolve(canvas);
    });
}

function drawScaledImage(ctx, img, x, y, width, height, scaleToFit) {
    let drawWidth, drawHeight, dx, dy;
    
    if (scaleToFit) {
      const scale = Math.min(width / img.width, height / img.height);
      drawWidth = img.width * scale;
      drawHeight = img.height * scale;
      dx = x + (width - drawWidth) / 2;
      dy = y + (height - drawHeight) / 2;
    } else {
      //Crop
      const imgRatio = img.width / img.height;
      const targetRatio = width / height;
      if (imgRatio > targetRatio) {
        drawHeight = height;
        drawWidth = img.width * (height / img.height);
        dx = x - (drawWidth - width) / 2;
        dy = y;
      } else {
        drawWidth = width;
        drawHeight = img.height * (width / img.width);
        dx = x;
        dy = y - (drawHeight - height) / 2;
      }
    }
    
    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
  }
  