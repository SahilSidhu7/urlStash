import React, { useState, useEffect } from 'react';

export default function MockPopup({ syncedTheme }) {
  // --- Preseeded Mock Window Tabs (representing user's open tabs) ---
  const [mockBrowserTabs, setMockBrowserTabs] = useState([
    { title: 'Figma - urlStash Design Specs', url: 'https://figma.com/file/urlStash' },
    { title: 'Dribbble - Soft UI Portfolio Inspirations', url: 'https://dribbble.com/inspirations' },
    { title: 'GitHub - antigravity/urlStash-extension', url: 'https://github.com/urlStash' },
    { title: 'React Docs - Build Interactive Interfaces', url: 'https://react.dev' }
  ]);

  const [activeBrowserTabIdx, setActiveBrowserTabIdx] = useState(0);

  // --- Extension Popup Internal State ---
  const [folders, setFolders] = useState({
    id: 'root',
    name: 'Root',
    type: 'folder',
    children: [
      {
        id: 'folder_1',
        name: 'Daily Research',
        type: 'folder',
        children: [
          { id: 'link_1', name: 'Product Hunt Launchpad', url: 'https://producthunt.com', type: 'link' },
          { id: 'link_2', name: 'TailwindCSS Gradients Palette', url: 'https://tailwindcss.com', type: 'link' }
        ]
      },
      {
        id: 'folder_2',
        name: 'Social Media',
        type: 'folder',
        children: [
          { id: 'link_3', name: 'Twitter / X', url: 'https://twitter.com', type: 'link' },
          { id: 'link_4', name: 'LinkedIn Professional Feed', url: 'https://linkedin.com', type: 'link' }
        ]
      }
    ]
  });

  const [expandedFolders, setExpandedFolders] = useState(['root', 'folder_1']);
  const [selectedFolderId, setSelectedFolderId] = useState('root');
  const [pageTitleInput, setPageTitleInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState('font-medium');
  const [widgetTheme, setWidgetTheme] = useState('dark');

  // Stash Page Success Indicator
  const [stashStatus, setStashStatus] = useState('Stash Page');
  const [successBg, setSuccessBg] = useState(false);

  // Dialog Config
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: '',
    placeholder: '',
    defaultValue: '',
    type: 'folder', // 'folder' or 'state'
    targetFolderId: 'root'
  });
  const [dialogInputValue, setDialogInputValue] = useState('');

  // Confirm Config
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: '',
    text: '',
    targetNode: null
  });

  // Keep widget theme synced with parent showcase site initially
  useEffect(() => {
    if (syncedTheme) {
      setWidgetTheme(syncedTheme);
    }
  }, [syncedTheme]);

  // Update input text whenever the active mock browser tab changes
  useEffect(() => {
    if (mockBrowserTabs.length > 0 && mockBrowserTabs[activeBrowserTabIdx]) {
      setPageTitleInput(mockBrowserTabs[activeBrowserTabIdx].title);
    } else {
      setPageTitleInput('');
    }
  }, [mockBrowserTabs, activeBrowserTabIdx]);

  // --- Tree Manipulation Helpers ---
  const findNodeById = (root, id) => {
    if (root.id === id) return root;
    if (root.children) {
      for (let child of root.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const deleteNodeById = (root, id) => {
    if (!root.children) return false;
    const index = root.children.findIndex(child => child.id === id);
    if (index !== -1) {
      root.children.splice(index, 1);
      return true;
    }
    for (let child of root.children) {
      if (deleteNodeById(child, id)) return true;
    }
    return false;
  };

  const getAllFolders = (root) => {
    let list = [];
    if (root.type === 'folder') {
      list.push({ id: root.id, name: root.name });
      if (root.children) {
        root.children.forEach(child => {
          list = list.concat(getAllFolders(child));
        });
      }
    }
    return list;
  };

  const getFolderDepth = (root, targetId, depth = 0) => {
    if (root.id === targetId) return depth;
    if (root.children) {
      for (let child of root.children) {
        const foundDepth = getFolderDepth(child, targetId, depth + 1);
        if (foundDepth !== -1) return foundDepth;
      }
    }
    return -1;
  };

  const checkMatchesSearch = (node, query) => {
    if (node.name.toLowerCase().includes(query)) return true;
    if (node.type === 'link' && node.url.toLowerCase().includes(query)) return true;
    if (node.type === 'folder' && node.children) {
      return node.children.some(child => checkMatchesSearch(child, query));
    }
    return false;
  };

  const cleanUrlDisplay = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
    } catch {
      return url;
    }
  };

  // --- Handlers ---
  const toggleFolderExpansion = (folderId) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleQuickNewFolder = () => {
    const parentNode = findNodeById(folders, selectedFolderId);
    if (!parentNode || parentNode.type !== 'folder') return;

    setDialogConfig({
      title: 'Create Folder',
      placeholder: 'E.g., Ideas, Work, Recipes',
      defaultValue: '',
      type: 'folder',
      targetFolderId: selectedFolderId
    });
    setDialogInputValue('');
    setIsDialogOpen(true);
  };

  const handleSaveState = () => {
    if (mockBrowserTabs.length === 0 || (mockBrowserTabs.length === 1 && mockBrowserTabs[0].title === 'New Tab')) {
      alert("No open browser pages to stash!");
      return;
    }

    const defaultStateName = mockBrowserTabs[0].title;
    setDialogConfig({
      title: 'Save Window State',
      placeholder: 'Enter name for your window state',
      defaultValue: defaultStateName,
      type: 'state',
      targetFolderId: selectedFolderId
    });
    setDialogInputValue(defaultStateName);
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = () => {
    if (!dialogInputValue.trim()) return;

    const parentNode = findNodeById(folders, dialogConfig.targetFolderId);
    if (!parentNode || parentNode.type !== 'folder') return;

    if (dialogConfig.type === 'folder') {
      const newFolderId = `folder_${Date.now()}`;
      const newFolder = {
        id: newFolderId,
        name: dialogInputValue.trim(),
        type: 'folder',
        children: []
      };

      parentNode.children.push(newFolder);
      setFolders({ ...folders });
      setExpandedFolders(prev => prev.includes(selectedFolderId) ? prev : [...prev, selectedFolderId]);
      setSelectedFolderId(newFolderId); // Auto select
    } else if (dialogConfig.type === 'state') {
      const stateFolderId = `folder_${Date.now()}`;
      const links = mockBrowserTabs.map((t, i) => ({
        id: `link_state_${Date.now()}_${i}`,
        name: t.title,
        url: t.url,
        type: 'link'
      }));

      const stateFolder = {
        id: stateFolderId,
        name: dialogInputValue.trim(),
        type: 'folder',
        children: links
      };

      parentNode.children.push(stateFolder);
      setFolders({ ...folders });
      setExpandedFolders(prev => {
        const list = [...prev];
        if (!list.includes(selectedFolderId)) list.push(selectedFolderId);
        list.push(stateFolderId);
        return list;
      });
    }

    setIsDialogOpen(false);
  };

  const handleAddPage = () => {
    if (mockBrowserTabs.length === 0 || mockBrowserTabs[activeBrowserTabIdx].title === 'New Tab') return;

    const parentNode = findNodeById(folders, selectedFolderId);
    if (!parentNode || parentNode.type !== 'folder') return;

    const newPageTitle = pageTitleInput.trim() || mockBrowserTabs[activeBrowserTabIdx].title;
    const newPageLink = {
      id: `link_${Date.now()}`,
      name: newPageTitle,
      url: mockBrowserTabs[activeBrowserTabIdx].url,
      type: 'link'
    };

    parentNode.children.push(newPageLink);
    setFolders({ ...folders });

    // Expand if collapsed
    if (!expandedFolders.includes(selectedFolderId)) {
      setExpandedFolders(prev => [...prev, selectedFolderId]);
    }

    // Success animation
    setStashStatus('Stashed!');
    setSuccessBg(true);
    setTimeout(() => {
      setStashStatus('Stash Page');
      setSuccessBg(false);
    }, 1500);
  };

  const handleDeleteClick = (node, e) => {
    e.stopPropagation();
    setConfirmConfig({
      title: 'Confirm Delete',
      text: node.type === 'folder'
        ? `This folder "${node.name}" contains nested pages/folders. Are you sure you want to delete it and all its contents?`
        : `Remove stashed link "${node.name}" from your collection?`,
      targetNode: node
    });
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    const node = confirmConfig.targetNode;
    if (!node) return;

    deleteNodeById(folders, node.id);
    setFolders({ ...folders });
    setExpandedFolders(prev => prev.filter(id => id !== node.id));
    setIsConfirmOpen(false);
  };

  const handleCloseAllTabs = () => {
    setConfirmConfig({
      title: 'Close All Tabs',
      text: 'This will save you some clutter! Open a clean new tab and close all other tabs?',
      targetNode: { id: 'special_action_close_all' }
    });
    setIsConfirmOpen(true);
  };

  const executeCloseAllTabs = () => {
    // Replaces all tabs with a single "New Tab"
    setMockBrowserTabs([
      { title: 'New Tab', url: 'chrome://newtab/' }
    ]);
    setActiveBrowserTabIdx(0);
    setIsConfirmOpen(false);
  };

  const openMockTab = (url, name) => {
    // Simulates opening a tab
    setMockBrowserTabs(prev => {
      // Check if already open
      const idx = prev.findIndex(t => t.url === url);
      if (idx !== -1) {
        setActiveBrowserTabIdx(idx);
        return prev;
      }
      const updated = [...prev, { title: name, url }];
      setActiveBrowserTabIdx(updated.length - 1);
      return updated;
    });
  };

  const openAllTabsInFolder = (node, e) => {
    e.stopPropagation();
    const urls = [];
    const collect = (n) => {
      if (n.type === 'link') urls.push({ title: n.name, url: n.url });
      else if (n.type === 'folder' && n.children) n.children.forEach(collect);
    };
    collect(node);

    if (urls.length === 0) return;

    setMockBrowserTabs(prev => {
      let current = [...prev];
      // Filter out 'New Tab' if it is the only one
      if (current.length === 1 && current[0].title === 'New Tab') {
        current = [];
      }
      urls.forEach(item => {
        if (!current.some(t => t.url === item.url)) {
          current.push(item);
        }
      });
      // Set active to the last added
      setTimeout(() => {
        setActiveBrowserTabIdx(current.length - 1);
      }, 0);
      return current;
    });
  };

  const closeMockTab = (idx, e) => {
    e.stopPropagation();
    if (mockBrowserTabs.length === 1) {
      setMockBrowserTabs([{ title: 'New Tab', url: 'chrome://newtab/' }]);
      setActiveBrowserTabIdx(0);
      return;
    }
    const updated = mockBrowserTabs.filter((_, i) => i !== idx);
    setMockBrowserTabs(updated);
    if (activeBrowserTabIdx >= updated.length) {
      setActiveBrowserTabIdx(updated.length - 1);
    }
  };

  // --- Recursive Render Function ---
  const renderMockTreeNode = (node, depth = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders.includes(node.id);
    const query = searchQuery.trim().toLowerCase();

    // Search filter
    if (query) {
      const matches = node.name.toLowerCase().includes(query) || (!isFolder && node.url.toLowerCase().includes(query));
      let childMatches = false;
      if (isFolder && node.children) {
        childMatches = node.children.some(c => checkMatchesSearch(c, query));
      }
      if (!matches && !childMatches) return null;
    }

    const count = isFolder && node.children ? node.children.length : 0;

    return (
      <div key={node.id} className="tree-node fade-in">
        <div
          className="tree-row"
          style={{ paddingLeft: `${Math.max(10, depth * 14)}px` }}
          onClick={() => isFolder ? toggleFolderExpansion(node.id) : openMockTab(node.url, node.name)}
        >
          {isFolder ? (
            <button
              className={`chevron-btn ${isExpanded ? 'expanded' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleFolderExpansion(node.id); }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </button>
          ) : (
            <div className="node-indent" />
          )}

          <span className={`node-icon ${isFolder ? 'folder-icon' : 'page-icon'}`}>
            {isFolder ? (
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
              </svg>
            )}
          </span>

          <div className="node-content">
            <span className="node-title">{node.name}</span>
            <span className="node-subtitle">
              {isFolder ? `${count} item${count !== 1 ? 's' : ''}` : cleanUrlDisplay(node.url)}
            </span>
          </div>

          <div className="node-actions">
            {isFolder ? (
              count > 0 && (
                <button
                  className="node-action-btn"
                  title="Open all tabs"
                  onClick={(e) => openAllTabsInFolder(node, e)}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13">
                    <path fill="currentColor" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                  </svg>
                </button>
              )
            ) : (
              <>
                <button
                  className="node-action-btn"
                  title="Open in Mock Browser"
                  onClick={(e) => { e.stopPropagation(); openMockTab(node.url, node.name); }}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13">
                    <path fill="currentColor" d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z" />
                  </svg>
                </button>
                <button
                  className="node-action-btn"
                  title="Open in new window"
                  onClick={(e) => { e.stopPropagation(); window.open(node.url, '_blank'); }}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13">
                    <path fill="currentColor" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                  </svg>
                </button>
              </>
            )}
            <button
              className="node-action-btn delete"
              title="Delete node"
              onClick={(e) => handleDeleteClick(node, e)}
            >
              <svg viewBox="0 0 24 24" width="13" height="13">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
          </div>
        </div>

        {isFolder && node.children && node.children.length > 0 && (
          <div className={`node-children ${isExpanded || query ? '' : 'collapsed'}`}>
            {node.children.map(child => renderMockTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const allFoldersList = getAllFolders(folders);
  const isMockNewTab = mockBrowserTabs.length === 1 && mockBrowserTabs[0].title === 'New Tab';

  return (
    <div className="sandbox-wrapper">
      {/* 1. MOCK BROWSER CHROME FRAME */}
      <div className="mock-browser-bar">
        <div className="browser-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>

        {/* Render interactive browser tabs */}
        <div className="browser-tabs-row">
          {mockBrowserTabs.map((tab, idx) => (
            <div
              key={idx}
              className={`browser-tab ${idx === activeBrowserTabIdx ? 'active' : ''}`}
              onClick={() => setActiveBrowserTabIdx(idx)}
            >
              <span className="tab-title-text">{tab.title}</span>
              <button
                className="tab-close-x"
                onClick={(e) => closeMockTab(idx, e)}
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="browser-add-tab-btn"
            onClick={() => {
              setMockBrowserTabs([...mockBrowserTabs, {
                title: 'Search Engine',
                url: 'https://google.com'
              }]);
              setActiveBrowserTabIdx(mockBrowserTabs.length);
            }}
          >
            +
          </button>
        </div>
      </div>

      <div className="mock-browser-url-field">
        <div className="arrow-icons">
          <span>←</span> <span>→</span> <span>↻</span>
        </div>
        <div className="url-input-mock">
          {mockBrowserTabs[activeBrowserTabIdx] ? mockBrowserTabs[activeBrowserTabIdx].url : 'chrome://newtab'}
        </div>
      </div>

      {/* 2. THE SIMULATED EXTENSION POPUP WIDGET */}
      <div className={`mock-popup-container theme-${widgetTheme} ${fontSize}`}>
        {/* Header */}
        <header className="app-header">
          <div className="logo-area">
            <svg className="logo-icon" viewBox="0 0 24 24" width="22" height="22">
              <path fill="currentColor" d="M19 5.5v13a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 18.5v-13A1.5 1.5 0 0 1 6.5 4h3.6a1.5 1.5 0 0 1 1.1.5l1.6 1.8h4.7A1.5 1.5 0 0 1 19 5.5zM17 9H7v2h10V9zm0 4H7v2h10v-2z" />
            </svg>
            <span className="logo-text">urlStash</span>
          </div>

          <div className="header-actions">
            <button
              className="btn-action-header"
              onClick={handleCloseAllTabs}
              title="Close all open window tabs"
            >
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
              <span>Close Tabs</span>
            </button>
            <button
              className="btn-icon"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              title="Settings"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 0 0-.59.22L3.99 8.67a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <div className="app-main">
          {/* Form Card */}
          <div className="card stash-card">
            <h3 className="card-title">Stash Current Tab</h3>

            <div className="form-group">
              <label>Page Title</label>
              <input
                type="text"
                value={pageTitleInput}
                onChange={(e) => setPageTitleInput(e.target.value)}
                placeholder={isMockNewTab ? "New Tab (Cannot stash)" : "Loading page..."}
                disabled={isMockNewTab}
              />
            </div>

            <div className="form-group">
              <label>Destination Folder</label>
              <div className="dropdown-row">
                <select
                  className="custom-select"
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                >
                  {allFoldersList.map(folder => {
                    const depth = getFolderDepth(folders, folder.id, 0);
                    const prefix = '— '.repeat(depth);
                    return (
                      <option key={folder.id} value={folder.id}>
                        {prefix + folder.name}
                      </option>
                    );
                  })}
                </select>

                <button
                  className="btn-secondary-icon"
                  onClick={handleQuickNewFolder}
                  title="Create folder inside selected"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3v2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="button-row">
              <button
                className="btn-primary"
                onClick={handleAddPage}
                disabled={isMockNewTab}
                style={successBg ? { backgroundColor: '#87a96b', color: '#ffffff' } : {}}
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                <span>{stashStatus}</span>
              </button>

              <button
                className="btn-secondary"
                onClick={handleSaveState}
                disabled={isMockNewTab}
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
                </svg>
                <span>Save State</span>
              </button>
            </div>
          </div>

          {/* Tree Display list */}
          <div className="tree-container">
            <div className="search-bar-row">
              <input
                type="text"
                placeholder="Search stashed pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>

            <div className="tree-root-element">
              {folders.children.length === 0 ? (
                <div className="empty-placeholder">No items stashed. Click "Stash Page" to start!</div>
              ) : (
                (() => {
                  const renderedNodes = folders.children.map(child => renderMockTreeNode(child, 0));
                  const validRendered = renderedNodes.filter(n => n !== null);
                  if (validRendered.length === 0 && searchQuery) {
                    return <div className="empty-placeholder">No matching stashed pages.</div>;
                  }
                  return renderedNodes;
                })()
              )}
            </div>
          </div>
        </div>

        {/* Dialog Overlays */}
        <div className={`dialog-overlay ${isDialogOpen ? '' : 'hidden'}`}>
          <div className="dialog-box">
            <h3 className="dialog-title">{dialogConfig.title}</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder={dialogConfig.placeholder}
                value={dialogInputValue}
                onChange={(e) => setDialogInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDialogSubmit()}
              />
            </div>
            <div className="dialog-actions">
              <button className="btn-dialog-secondary" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="btn-dialog-primary" onClick={handleDialogSubmit}>
                {dialogConfig.type === 'folder' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <div className={`dialog-overlay ${isConfirmOpen ? '' : 'hidden'}`}>
          <div className="dialog-box">
            <h3 className="dialog-title">{confirmConfig.title}</h3>
            <p className="dialog-description">{confirmConfig.text}</p>
            <div className="dialog-actions">
              <button className="btn-dialog-secondary" onClick={() => setIsConfirmOpen(false)}>Cancel</button>
              <button
                className={confirmConfig.targetNode?.id === 'special_action_close_all' ? 'btn-dialog-primary' : 'btn-dialog-danger'}
                onClick={() => {
                  if (confirmConfig.targetNode?.id === 'special_action_close_all') {
                    executeCloseAllTabs();
                  } else {
                    handleConfirmSubmit();
                  }
                }}
              >
                {confirmConfig.targetNode?.id === 'special_action_close_all' ? 'Close All' : 'Delete'}
              </button>
            </div>
          </div>
        </div>

        {/* Settings Drawer */}
        <div className={`settings-drawer ${isSettingsOpen ? '' : 'hidden'}`}>
          <div className="drawer-header">
            <span className="drawer-title">Settings</span>
            <button className="btn-icon" onClick={() => setIsSettingsOpen(false)}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </button>
          </div>

          <div className="drawer-body">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Theme</span>
                <span className="setting-desc">Soft beige or shades of black</span>
              </div>
              <div className="theme-toggle-group">
                <button
                  className={`theme-select-btn ${widgetTheme === 'light' ? 'active' : ''}`}
                  onClick={() => setWidgetTheme('light')}
                >
                  <span className="theme-preview light"></span>Beige
                </button>
                <button
                  className={`theme-select-btn ${widgetTheme === 'dark' ? 'active' : ''}`}
                  onClick={() => setWidgetTheme('dark')}
                >
                  <span className="theme-preview dark"></span>Black
                </button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Font Size</span>
                <span className="setting-desc">Adjust interface text dimensions</span>
              </div>
              <select
                className="custom-select"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
              >
                <option value="font-small">Small</option>
                <option value="font-medium">Medium</option>
                <option value="font-large">Large</option>
              </select>
            </div>

            <div className="version-tag">urlStash Sandbox</div>
          </div>
        </div>
      </div>
    </div>
  );
}
