import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    //Save all url images in images state
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const imagesUrl = data.map((image) => {
          return image.url;
        });
        setImages(imagesUrl);
      });
  }, []);

  const addMoveable = () => {
    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: images[Math.floor(Math.random() * images.length)],
        updateEnd: true,
      },
    ]);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
            moveableComponents ={moveableComponents}
          />
        ))}
      </div>
    </main>
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  color,
  id,
  setSelected,
  isSelected = false,
  updateEnd,
 
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();

  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    // Verify that the moveable component doesn't go outside the borders of its parent
    let positionMaxTop;
    if (top === 0 && top + newHeight > 0) {
      positionMaxTop = 0;
      newHeight = height;
      top = 0;
    } else {
      positionMaxTop = top + newHeight;
    }

    let positionMaxLeft;
    if (left === 0 && left + newWidth > 0) {
      positionMaxLeft = 0;
      newWidth = height;
      left = 0;
    } else {
      positionMaxLeft = left + newWidth;
    }

    if (parentBounds?.height - positionMaxTop < 100) {
      positionMaxTop = parentBounds?.height - newHeight;
      newHeight = height;
    }
    if (parentBounds?.width - positionMaxLeft < 100) {
      positionMaxLeft = parentBounds?.widt - newWidth;
      newWidth = width;
    }

    /*if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;
*/
    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      color,
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    // console.log(translateX + " " + translateY);

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  const onResizeEnd = async (e) => {
    let newWidth = e.lastEvent?.width;
    let newHeight = e.lastEvent?.height;
    // Verify that the moveable component doesn't go outside the borders of its parent
    let positionMaxTop;
    if (top === 0 && top + newHeight > 0) {
      positionMaxTop = 0;
      newHeight = height;
      top = 0;
    } else {
      positionMaxTop = top + newHeight;
    }

    let positionMaxLeft;
    if (left === 0 && left + newWidth > 0) {
      positionMaxLeft = 0;
      newWidth = height;
      left = 0;
    } else {
      positionMaxLeft = left + newWidth;
    }

    if (parentBounds?.height - positionMaxTop < 100) {
      positionMaxTop = parentBounds?.height - newHeight;
      newHeight = height;
    }
    if (parentBounds?.width - positionMaxLeft < 100) {
      positionMaxLeft = parentBounds?.widt - newWidth;
      newWidth = width;
    }
    /* const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;
*/
    const { lastEvent } = e;
    const { drag } = lastEvent;
    const { beforeTranslate } = drag;

    const absoluteTop = top + beforeTranslate[1];
    const absoluteLeft = left + beforeTranslate[0];

    updateMoveable(
      id,
      {
        top: absoluteTop,
        left: absoluteLeft,
        width: newWidth,
        height: newHeight,
        color,
      },
      true
    );
  };

  const onDrag = async (e) => {
    let top = e.top;
    let left = e.left;
    // Verify that the moveable component doesn't go outside the borders of its parent

    if (parentBounds?.height - top < e.height) {
      top = parentBounds?.height - e.height;
    }

    if (top < 0) {
      top = 0;
    }

    if (parentBounds?.width - left < e.width) {
      left = parentBounds?.widt - e.width;
    }

    if (left < 0) {
      left = 0;
    }
    updateMoveable(id, {
      top: top,
      left: left,
      width,
      height,
      color,
    });
  };



  }
  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          backgroundImage: `url(${color})`,
          objectFit: "contain",
        }}
        onClick={() => setSelected(id)}
      />

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        onDrag={onDrag}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};
