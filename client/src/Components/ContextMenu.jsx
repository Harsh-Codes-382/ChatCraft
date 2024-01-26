import React, { useEffect, useRef } from "react";

function ContextMenu({ options, coordinates, contextMenu, setContextMenu }) {
    const contextMenuRef = useRef(null);

    useEffect(() => {
        const handleOutSideClick = (event) => {
            if (event.target.id !== "context-opener") {
                if (
                    contextMenuRef.current &&
                    !contextMenuRef.current.contains(event.target)
                ) {
                    setContextMenu(false);
                }
            }
        };
        document.addEventListener("click", handleOutSideClick);

        return () => {
            document.removeEventListener("click", handleOutSideClick);
        };
    }, []);

    const handleClick = (e, callback) => {
        e.stopPropagation();
        setContextMenu(false);
        callback();
    };

    return (
        <div
            className={`bg-dropdown-background fixed py-2 z-[100] shadow-xl`}
            ref={contextMenuRef}
            style={{
                top: coordinates.y,
                left: coordinates.x,
            }}
        >
            <ul>
                {options.map(({ name, callback }) => {
                    return (
                        <li
                            className="px-5 py-2 cursor-pointer hover:bg-background-default-hover"
                            key={name}
                            onClick={(e) => handleClick(e, callback)}
                        >
                            <span className="text-white">{name}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default ContextMenu;