// Source code licensed under Apache License 2.0. 
// Copyright © 2017 William Ngan. (https://github.com/williamngan/pts)

window.demoDescription = "Canvas textbox that fit single and multiline text in boxes with truncations. Resize browser window to reflow text.";

(function() {

  Pts.namespace( this );

  var space = new CanvasSpace("#pt").setup({bgcolor: "#0c9", resize: true, retina: true});
  var form = space.getForm();


  //// Demo code ---

  let grid = [];
  let headerResize;

  let layout = () => {
    let gs = Rectangle.halves( space.innerBound, 0.3, true );   
    grid = Create.gridCells( Bound.fromGroup(gs[1]), 4, 1 );
    grid.unshift( gs[0] );
  }

  space.add({ 

    start:( bound ) => {
      layout();
      headerResize = Typography.fontSizeToBox( grid[0], 0.8 ); // a function to resize header font
    },

    animate: (time, ftime) => {
      
      // measure text width accurately
      form.fontWidthEstimate(false);
      form.fillOnly("#123").font( headerResize( grid[0] ) ).alignText("left");
      form.textBox( grid[0], "The Metamorphosis", "middle", "ᔘ" );

      form.font( 14 ).alignText( "right" );
      form.fillOnly("#fff").textBox( grid[0], "By Franz Kafka", "bottom", "..." );

      form.fillOnly("#123").font(42).alignText("left").textBox( grid[1], "One morning", "top", "☀ " );
      form.font(16).alignText("center").textBox( grid[1], "when Gregor Samsa woke", "middle", "☟" );
      form.font(14).alignText("right").textBox( grid[1], "from troubled dreams", "bottom", "🐜" );

      form.font(30).paragraphBox( grid[2], "he found himself transformed in his bed into a horrible vermin." )
      form.font(12).alignText("left").paragraphBox( grid[3], "He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked.", 2, "middle", true );

      // measure text width by estimate (faster but less accurate)
      form.fontWidthEstimate(true);
      form.font(16).alignText("left").paragraphBox( grid[4], "'What's happened to me'?\nhe thought.\nIt wasn't a dream.\nHis room, a proper human room although a little too small, lay peacefully between its four familiar walls.")
      form.font(11).alignText("right").paragraphBox( grid[4], "A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.", 1, "bottom" )
      form.strokeOnly("#fff").rects( grid );
    },

    resize: (bound, evt) => { 
      layout();
    }
    
  });

  //// ----
  

  space.bindMouse().bindTouch().play();

})();