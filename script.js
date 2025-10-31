window.onload = () => {
    // Calculate optimal sizes for professional single-screen layout
    const headerHeight = 70;
    const footerHeight = 70;
    const toolboxWidth = 180;
    const padding = 32;
    const toolsPanelHeight = 60;
    const gap = 16;
    
    const availableHeight = window.innerHeight - headerHeight - footerHeight - toolsPanelHeight - padding - gap;
    const availableWidth = window.innerWidth - toolboxWidth - padding - gap;
    
    // Optimal canvas size - professional aspect ratio
    const maxSize = Math.min(availableWidth, availableHeight);
    const stageWidth = Math.floor(Math.min(520, maxSize));
    const stageHeight = Math.floor(Math.min(480, maxSize * 0.92));
    const PUMPKIN_WIDTH = Math.floor(stageWidth * 0.82);
    const PUMPKIN_HEIGHT = Math.floor(stageHeight * 0.82);

    // Initialize Konva Stage
    const stage = new Konva.Stage({
        container: 'stage-container',
        width: stageWidth,
        height: stageHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // Add Transformer for resizing and rotating (must be before functions that use it)
    const transformer = new Konva.Transformer({
        nodes: [],
        keepRatio: true,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center'],
        rotateAnchorOffset: 40,
        boundBoxFunc: (oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) {
                return oldBox;
            }
            return newBox;
        },
    });
    layer.add(transformer);

    // History for undo/redo
    let history = [];
    let historyStep = -1;
    const MAX_HISTORY = 50;

    function saveState() {
        // Remove future history if we're not at the end
        if (historyStep < history.length - 1) {
            history = history.slice(0, historyStep + 1);
        }
        
        // Save current state - serialize all parts except pumpkin
        const parts = [];
        layer.children.forEach((child) => {
            if (child !== pumpkinImage && child instanceof Konva.Image) {
                parts.push({
                    src: child.image().src || '',
                    attrs: {
                        x: child.x(),
                        y: child.y(),
                        width: child.width(),
                        height: child.height(),
                        offsetX: child.offsetX(),
                        offsetY: child.offsetY(),
                        rotation: child.rotation(),
                        scaleX: child.scaleX(),
                        scaleY: child.scaleY(),
                    }
                });
            }
        });
        
        history.push(JSON.parse(JSON.stringify(parts)));
        
        // Limit history size
        if (history.length > MAX_HISTORY) {
            history.shift();
        } else {
            historyStep++;
        }
        
        updateHistoryButtons();
    }

    function updateHistoryButtons() {
        document.getElementById('undo-btn').disabled = historyStep <= 0;
        document.getElementById('redo-btn').disabled = historyStep >= history.length - 1;
    }

    function undo() {
        if (historyStep > 0) {
            historyStep--;
            // Remove all parts except pumpkin and transformer
            layer.children.forEach((child) => {
                if (child !== pumpkinImage && child !== transformer && child instanceof Konva.Image) {
                    child.destroy();
                }
            });
            
            // Restore parts from history
            if (historyStep >= 0 && history[historyStep]) {
                restoreParts(history[historyStep]);
            }
            
            transformer.nodes([]);
            layer.draw();
            updateHistoryButtons();
        }
    }

    function redo() {
        if (historyStep < history.length - 1) {
            historyStep++;
            // Remove all parts except pumpkin and transformer
            layer.children.forEach((child) => {
                if (child !== pumpkinImage && child !== transformer && child instanceof Konva.Image) {
                    child.destroy();
                }
            });
            
            // Restore parts from history
            if (history[historyStep]) {
                restoreParts(history[historyStep]);
            }
            
            transformer.nodes([]);
            layer.draw();
            updateHistoryButtons();
        }
    }

    function restoreParts(partsData) {
        // Restore all parts
        if (Array.isArray(partsData)) {
            partsData.forEach(partData => {
                if (partData.src) {
                    Konva.Image.fromURL(partData.src, (img) => {
                        img.setAttrs({
                            ...partData.attrs,
                            draggable: true,
                        });
                        layer.add(img);
                        img.moveToTop();
                    });
                }
            });
            layer.draw();
        }
    }

    // Load the base pumpkin image
    let pumpkinImage;
    function loadPumpkin() {
        // Create pumpkin SVG with dynamic coordinates
        const centerX = PUMPKIN_WIDTH / 2;
        const centerY = PUMPKIN_HEIGHT / 2;
        const radiusX = PUMPKIN_WIDTH * 0.48;
        const radiusY = PUMPKIN_HEIGHT * 0.52;
        const stemY = PUMPKIN_HEIGHT * 0.08;
        const stemX1 = centerX - PUMPKIN_WIDTH * 0.2;
        const stemX2 = centerX + PUMPKIN_WIDTH * 0.2;
        
        const pumpkinSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${PUMPKIN_WIDTH}" height="${PUMPKIN_HEIGHT}">
                <defs>
                    <radialGradient id="pumpkinGrad${Date.now()}" cx="50%" cy="30%">
                        <stop offset="0%" style="stop-color:#FF8C00;stop-opacity:1" />
                        <stop offset="70%" style="stop-color:#FF6B00;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#E55A00;stop-opacity:1" />
                    </radialGradient>
                </defs>
                <ellipse cx="${centerX}" cy="${centerY}" rx="${radiusX}" ry="${radiusY}" fill="url(#pumpkinGrad${Date.now()})"/>
                <ellipse cx="${centerX}" cy="${centerY + PUMPKIN_HEIGHT * 0.08}" rx="${radiusX * 0.9}" ry="${radiusY * 0.85}" fill="#E55A00" opacity="0.6"/>
                <path d="M ${stemX1} ${stemY} Q ${centerX} ${stemY * 0.6} ${stemX2} ${stemY}" stroke="#8B4513" stroke-width="${PUMPKIN_WIDTH * 0.02}" fill="none"/>
            </svg>
        `;
        
        const dataURL = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(pumpkinSVG)));
        
        Konva.Image.fromURL(dataURL, (img) => {
            pumpkinImage = img;
            img.setAttrs({
                x: (stageWidth - PUMPKIN_WIDTH) / 2,
                y: (stageHeight - PUMPKIN_HEIGHT) / 2,
                width: PUMPKIN_WIDTH,
                height: PUMPKIN_HEIGHT,
                listening: false,
            });
            layer.add(img);
            img.moveToBottom();
            layer.draw();
            
            // Save initial state
            if (history.length === 0) {
                saveState();
            }
        });
    }
    
    loadPumpkin();

    // Handle Drag and Drop from HTML to Canvas
    let draggedAsset = null;

    document.querySelectorAll('#toolbox .asset').forEach((asset) => {
        asset.addEventListener('dragstart', (e) => {
            draggedAsset = e.target;
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('text/html', e.target.src);
        });
        
        asset.addEventListener('dragend', (e) => {
            // Reset draggedAsset after drag ends
            setTimeout(() => {
                draggedAsset = null;
            }, 100);
        });
    });

    const stageContainer = stage.container();

    stageContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    });

    stageContainer.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    stageContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!draggedAsset) {
            // Fallback: try to get from dataTransfer
            const src = e.dataTransfer.getData('text/html');
            if (!src) return;
            
            const rect = stageContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const pos = stage.getPointerPosition() || { x, y };
            
            // Try to find the asset by src
            const asset = Array.from(document.querySelectorAll('#toolbox .asset')).find(img => img.src === src);
            if (asset) {
                addPartToCanvas(src, pos, asset.dataset.size || 80);
            }
            return;
        }

        const rect = stageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        stage.setPointersPositions(e);
        const pos = stage.getPointerPosition() || { x, y };

        addPartToCanvas(draggedAsset.src, pos, draggedAsset.dataset.size || 80);
        draggedAsset = null;
    });

    // Function to add a new draggable part with proper sizing
    function addPartToCanvas(src, pos, defaultSize = 80) {
        Konva.Image.fromURL(src, (img) => {
            // Calculate size relative to pumpkin (pumpkin is 500px, default size should be ~60-120px)
            const sizeRatio = parseFloat(defaultSize) || 80;
            const targetSize = Math.max(40, Math.min(150, sizeRatio * (PUMPKIN_WIDTH / 600)));
            
            img.setAttrs({
                x: pos.x,
                y: pos.y,
                draggable: true,
                width: targetSize,
                height: targetSize,
            });
            
            // Center on cursor
            img.offsetX(targetSize / 2);
            img.offsetY(targetSize / 2);
            
            // Move to top so it's above pumpkin
            img.moveToTop();

            layer.add(img);
            layer.draw();
            saveState();
        });
    }

    // Selection handling
    stage.on('click tap', (e) => {
        if (e.target === stage || e.target === pumpkinImage) {
            transformer.nodes([]);
            layer.draw();
            return;
        }

        if (e.target.getParent() !== transformer && e.target !== transformer) {
            transformer.nodes([e.target]);
            layer.draw();
        }
    });

    // Save state when transformer changes (resize/rotate)
    transformer.on('transformend', () => {
        saveState();
    });

    // Save state when dragging ends
    layer.on('dragend', () => {
        saveState();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Delete key
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (transformer.nodes().length > 0 && !e.target.matches('input, textarea')) {
                deleteSelected();
            }
        }
        // Undo/Redo with Ctrl/Cmd
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault();
            redo();
        }
    });

    // Delete selected parts
    function deleteSelected() {
        const selected = transformer.nodes();
        if (selected.length > 0) {
            selected.forEach(node => {
                if (node !== pumpkinImage) {
                    node.destroy();
                }
            });
            transformer.nodes([]);
            layer.draw();
            saveState();
        }
    }

    // Duplicate selected
    function duplicateSelected() {
        const selected = transformer.nodes();
        if (selected.length > 0) {
            selected.forEach(node => {
                if (node !== pumpkinImage && node instanceof Konva.Image) {
                    Konva.Image.fromURL(node.image().src, (newImg) => {
                        newImg.setAttrs({
                            x: node.x() + 30,
                            y: node.y() + 30,
                            width: node.width(),
                            height: node.height(),
                            draggable: true,
                            offsetX: node.offsetX(),
                            offsetY: node.offsetY(),
                            rotation: node.rotation(),
                        });
                        layer.add(newImg);
                        newImg.moveToTop();
                    });
                }
            });
            transformer.nodes([]);
            layer.draw();
            saveState();
        }
    }

    // Clear all parts
    function clearAll() {
        if (confirm('Clear all parts? This cannot be undone.')) {
            layer.destroyChildren();
            loadPumpkin();
            saveState();
        }
    }

    // Tool buttons
    document.getElementById('delete-btn').addEventListener('click', deleteSelected);
    document.getElementById('duplicate-btn').addEventListener('click', duplicateSelected);
    document.getElementById('clear-btn').addEventListener('click', clearAll);
    document.getElementById('undo-btn').addEventListener('click', undo);
    document.getElementById('redo-btn').addEventListener('click', redo);

    // Download button
    document.getElementById('download-btn').addEventListener('click', () => {
        transformer.nodes([]);
        layer.draw();

        const dataURL = stage.toDataURL({
            pixelRatio: 2,
        });

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `pumpkin-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Share button
    document.getElementById('share-btn').addEventListener('click', () => {
        transformer.nodes([]);
        layer.draw();

        const dataURL = stage.toDataURL({
            pixelRatio: 2,
        });

        // Copy to clipboard if supported
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(dataURL).then(() => {
                alert('Image link copied to clipboard!');
            }).catch(() => {
                // Fallback: copy data URL to input
                fallbackCopy(dataURL);
            });
        } else {
            fallbackCopy(dataURL);
        }
    });

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('Image link copied to clipboard!');
        } catch (err) {
            prompt('Copy this link:', text);
        }
        document.body.removeChild(textarea);
    }

    // Update history buttons initially
    updateHistoryButtons();
};