import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import eventBus from "../eventbus.js";
import PanelRightToolbar from "./PanelRightToolbar.js"; // Import to identify toolbar
const PanelRight = ({ panelWidth = 325, // Default width if not provided
panelResize = true, panelType = "first", // Default to "first" if not explicitly defined
children, }) => {
    const [isActive, setIsActive] = useState(panelType === "first"); // Initialize based on the panelType
    const [width, setWidth] = useState(panelWidth); // Initial width from props or default
    const [isHandleHovered, setIsHandleHovered] = useState(false);
    useEffect(() => {
        // Initialize shared width if not already set in the EventBus
        if (eventBus.getPanelWidth() === 400) {
            eventBus.setPanelWidth(panelWidth); // Use the provided panelWidth prop
        }
        setWidth(eventBus.getPanelWidth()); // Set the current width from EventBus
        const handleActivePanel = (panel) => {
            setIsActive(panel === panelType); // Check if this panelType matches the active panel
        };
        const handleWidthChange = (newWidth) => {
            setWidth(newWidth); // Update width when EventBus notifies
        };
        eventBus.on("setActivePanel", handleActivePanel);
        eventBus.on("panelWidthChanged", handleWidthChange);
        return () => {
            eventBus.off("setActivePanel", handleActivePanel);
            eventBus.off("panelWidthChanged", handleWidthChange);
        };
    }, [panelType, panelWidth]);
    const handleMouseDown = (e) => {
        if (!panelResize)
            return;
        const startX = e.clientX;
        const startWidth = width;
        const onMouseMove = (moveEvent) => {
            const newWidth = Math.min(500, // Max width
            Math.max(256, startWidth - (moveEvent.clientX - startX)) // Min width
            );
            setWidth(newWidth);
            eventBus.setPanelWidth(newWidth); // Persist the new width in EventBus
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.body.style.userSelect = "";
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        document.body.style.userSelect = "none";
    };
    if (!isActive)
        return null; // Do not render if not active
    const childrenArray = React.Children.toArray(children);
    const toolbar = childrenArray.find((child) => React.isValidElement(child) && child.type === PanelRightToolbar);
    const content = childrenArray.filter((child) => !(React.isValidElement(child) && child.type === PanelRightToolbar));
    return (_jsxs("div", { className: "panelRight", style: {
            width: `${width}px`,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--colorNeutralBackground4)",
            height: "100%",
            boxSizing: "border-box",
            position: "relative",
            borderLeft: panelResize
                ? isHandleHovered
                    ? "2px solid var(--colorNeutralStroke2)"
                    : "2px solid transparent"
                : "none",
        }, children: [toolbar && _jsx("div", { style: { flexShrink: 0 }, children: toolbar }), _jsx("div", { className: "panelContent", style: {
                    flex: 1,
                    overflowY: "auto",
                }, children: content }), panelResize && (_jsx("div", { className: "resizeHandle", onMouseDown: handleMouseDown, onMouseEnter: () => setIsHandleHovered(true), onMouseLeave: () => setIsHandleHovered(false), style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "2px",
                    height: "100%",
                    cursor: "ew-resize",
                    zIndex: 1,
                    backgroundColor: isHandleHovered
                        ? "var(--colorNeutralStroke2)"
                        : "transparent",
                } }))] }));
};
export default PanelRight;
