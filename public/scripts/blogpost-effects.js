			(function() {
				function init() {
				// 阅读进度条
				var progress = document.querySelector('.mesh-read-progress');
				var article = document.querySelector('.mesh-article');
				var toast = document.querySelector('.mesh-stage-toast');
				var stageSeen = { p30: false, p60: false, p90: false };
				var toastTimer = 0;
				var hasScrolled = false;
				function showStageToast(msg) {
					if (!toast) return;
					toast.textContent = msg;
					toast.classList.add('visible');
					clearTimeout(toastTimer);
					toastTimer = setTimeout(function() {
						toast.classList.remove('visible');
					}, 900);
				}
				if (progress) {
					function onScroll() {
						var scrollTop = window.scrollY || document.documentElement.scrollTop;
						var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
						var p = scrollHeight > 0 ? Math.min(1, scrollTop / scrollHeight) : 1;
						progress.style.setProperty('--read-progress', String(p));
						var btn = document.querySelector('.mesh-back-to-top');
						if (btn) btn.classList.toggle('visible', scrollTop > 400);
						if (!hasScrolled && scrollTop > 6) hasScrolled = true;
						if (!hasScrolled) return;
						if (!stageSeen.p30 && p >= 0.3) {
							stageSeen.p30 = true;
							showStageToast('context parsed');
						}
						if (!stageSeen.p60 && p >= 0.6) {
							stageSeen.p60 = true;
							showStageToast('inference stable');
						}
						if (!stageSeen.p90 && p >= 0.9) {
							stageSeen.p90 = true;
							showStageToast('output finalized');
						}
					}
					onScroll();
					window.addEventListener('scroll', onScroll, { passive: true });
				}
				var backTop = document.querySelector('.mesh-back-to-top');
				if (backTop) {
					backTop.addEventListener('click', function() {
						window.scrollTo({ top: 0, behavior: 'smooth' });
					});
				}
				function initHeroCanvas() {
					var shell = document.querySelector('.hero-shell');
					if (!shell) return;
					var canvas = shell.querySelector('.hero-canvas');
					var wrap = shell.querySelector('.hero-canvas-wrap');
					if (!canvas || !wrap) return;
					var src = canvas.getAttribute('data-hero-src');
					if (!src) return;

					var heroStart = 0;
					var heroRaf = 0;
					// offscreen canvas for base image
					var baseCanvas = document.createElement('canvas');
					var baseCtx = baseCanvas.getContext('2d');
					// offscreen canvas reused for pixelation
					var pixelCanvas = document.createElement('canvas');
					var pixelCtx = pixelCanvas.getContext('2d');
					// offscreen canvas reused for static bursts
					var noiseCanvas = document.createElement('canvas');
					var noiseCtx = noiseCanvas.getContext('2d');
					// offscreen canvas for edge detection
					var edgeCanvas = document.createElement('canvas');
					var edgeCtx = edgeCanvas.getContext('2d');
					var edgeReady = false;

					// Phase timing (seconds)
					var EDGE_PHASE = 1.8;      // show edge detection
					var REVEAL_PHASE = 2.5;     // progressive reveal (pixelated -> sharp)
					var INTRO_END = EDGE_PHASE + REVEAL_PHASE; // after this, ongoing glitch

					function sizeCanvas() {
						var rect = shell.querySelector('.hero-stack').getBoundingClientRect();
						var dpr = Math.min(window.devicePixelRatio || 1, 2);
						canvas.width = Math.max(2, Math.round(rect.width * dpr));
						canvas.height = Math.max(2, Math.round(rect.height * dpr));
						canvas.style.width = rect.width + 'px';
						canvas.style.height = rect.height + 'px';
						noiseCanvas.width = canvas.width;
						noiseCanvas.height = 64;
					}

					function drawBase(ctx, img, w, h) {
						var iw = img.width, ih = img.height;
						var scale = Math.max(w / iw, h / ih);
						var sw = w / scale, sh = h / scale;
						var sx = (iw - sw) / 2, sy = (ih - sh) / 2;
						ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
					}

					function buildEdge(img) {
						var w = canvas.width, h = canvas.height;
						edgeCanvas.width = w;
						edgeCanvas.height = h;
						baseCanvas.width = w;
						baseCanvas.height = h;
						drawBase(baseCtx, img, w, h);
						drawBase(edgeCtx, img, w, h);
						// Sobel edge detection
						var src = edgeCtx.getImageData(0, 0, w, h);
						var d = src.data;
						var out = edgeCtx.createImageData(w, h);
						var od = out.data;
						for (var y = 1; y < h - 1; y++) {
							for (var x = 1; x < w - 1; x++) {
								var idx = function(px, py) { return ((py * w) + px) * 4; };
								var i = idx(x, y);
								// grayscale neighbors
								function luma(px, py) {
									var j = idx(px, py);
									return d[j] * 0.299 + d[j+1] * 0.587 + d[j+2] * 0.114;
								}
								var gx = -luma(x-1,y-1) - 2*luma(x-1,y) - luma(x-1,y+1)
								         + luma(x+1,y-1) + 2*luma(x+1,y) + luma(x+1,y+1);
								var gy = -luma(x-1,y-1) - 2*luma(x,y-1) - luma(x+1,y-1)
								         + luma(x-1,y+1) + 2*luma(x,y+1) + luma(x+1,y+1);
								var mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));
								// cyan-tinted edges
								od[i]   = Math.min(255, mag * 0.4);
								od[i+1] = Math.min(255, mag * 0.85);
								od[i+2] = Math.min(255, mag * 1.0);
								od[i+3] = mag > 20 ? Math.min(255, mag * 1.5) : 0;
							}
						}
						edgeCtx.putImageData(out, 0, 0);
						edgeReady = true;
					}

					function heroRender(t) {
						if (!heroStart) heroStart = t;
						var elapsed = (t - heroStart) * 0.001;
						var ctx = canvas.getContext('2d');
						if (!ctx || !canvas.img) { heroRaf = requestAnimationFrame(heroRender); return; }
						var w = canvas.width, h = canvas.height;

						ctx.clearRect(0, 0, w, h);

						if (elapsed < EDGE_PHASE && edgeReady) {
							// Phase 1: Edge detection wireframe
							var edgeFade = Math.min(1, elapsed / 0.5);
							// dark background
							ctx.fillStyle = 'rgba(8, 16, 28, 1)';
							ctx.fillRect(0, 0, w, h);
							// draw edges with fade-in
							ctx.globalAlpha = edgeFade;
							ctx.drawImage(edgeCanvas, 0, 0);
							ctx.globalAlpha = 1;
							// scanning line
							var scanY = (elapsed / EDGE_PHASE) * h;
							ctx.fillStyle = 'rgba(120, 220, 255, 0.3)';
							ctx.fillRect(0, scanY - 1, w, 2);
							var scanGlow = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
							scanGlow.addColorStop(0, 'rgba(120, 220, 255, 0)');
							scanGlow.addColorStop(0.5, 'rgba(120, 220, 255, 0.15)');
							scanGlow.addColorStop(1, 'rgba(120, 220, 255, 0)');
							ctx.fillStyle = scanGlow;
							ctx.fillRect(0, scanY - 30, w, 60);

						} else if (elapsed < INTRO_END) {
							// Phase 2: Progressive reveal — pixelated to sharp
							var revealT = (elapsed - EDGE_PHASE) / REVEAL_PHASE;
							// pixel size: starts large, shrinks to 1
							var maxBlock = 32;
							var blockSize = Math.max(1, Math.round(maxBlock * (1 - revealT * revealT)));
							// draw pixelated
							if (blockSize > 1) {
								var smallW = Math.max(1, Math.ceil(w / blockSize));
								var smallH = Math.max(1, Math.ceil(h / blockSize));
								if (pixelCanvas.width !== smallW || pixelCanvas.height !== smallH) {
									pixelCanvas.width = smallW;
									pixelCanvas.height = smallH;
								}
								pixelCtx.clearRect(0, 0, smallW, smallH);
								pixelCtx.drawImage(baseCanvas, 0, 0, smallW, smallH);
								ctx.imageSmoothingEnabled = false;
								ctx.drawImage(pixelCanvas, 0, 0, smallW, smallH, 0, 0, w, h);
								ctx.imageSmoothingEnabled = true;
							} else {
								ctx.drawImage(baseCanvas, 0, 0);
							}
							// fade out cyan tint
							var tintAlpha = 0.18 * (1 - revealT);
							ctx.globalCompositeOperation = 'screen';
							ctx.fillStyle = 'rgba(100, 200, 255, ' + tintAlpha + ')';
							ctx.fillRect(0, 0, w, h);
							ctx.globalCompositeOperation = 'source-over';

						} else {
							// Phase 3: Full image with ongoing scan + glitch
							ctx.drawImage(baseCanvas, 0, 0);

							// Scanlines
							ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
							for (var i = 0; i < h; i += 3) {
								ctx.fillRect(0, i, w, 1);
							}

							// Moving scan bar
							var scanPos = ((elapsed * 40) % (h + 60)) - 30;
							var barGrad = ctx.createLinearGradient(0, scanPos - 30, 0, scanPos + 30);
							barGrad.addColorStop(0, 'rgba(120, 220, 255, 0)');
							barGrad.addColorStop(0.5, 'rgba(120, 220, 255, 0.06)');
							barGrad.addColorStop(1, 'rgba(120, 220, 255, 0)');
							ctx.fillStyle = barGrad;
							ctx.fillRect(0, scanPos - 30, w, 60);

							// RGB channel glitch (random, ~8% of frames)
							if (Math.random() < 0.08) {
								var glitchY = Math.random() * h;
								var glitchH = 2 + Math.random() * 12;
								var shiftX = (Math.random() - 0.5) * 12;
								ctx.save();
								ctx.globalAlpha = 0.22;
								ctx.drawImage(
									baseCanvas,
									0,
									Math.floor(glitchY),
									w,
									Math.ceil(glitchH),
									Math.round(shiftX),
									Math.floor(glitchY),
									w,
									Math.ceil(glitchH)
								);
								ctx.restore();
							}

							// Brief static burst (~3% of frames)
							if (Math.random() < 0.03) {
								var burstY = Math.random() * h * 0.8;
								var burstH = 4 + Math.random() * 20;
								if (noiseCanvas.width !== w) {
									noiseCanvas.width = w;
									noiseCanvas.height = 64;
								}
								noiseCtx.clearRect(0, 0, noiseCanvas.width, noiseCanvas.height);
								for (var n = 0; n < 180; n++) {
									var nx = Math.random() * noiseCanvas.width;
									var ny = Math.random() * noiseCanvas.height;
									var nw = 1 + Math.random() * 3;
									var nh = 1 + Math.random() * 2;
									var alpha = 0.08 + Math.random() * 0.18;
									noiseCtx.fillStyle = 'rgba(160,220,255,' + alpha.toFixed(3) + ')';
									noiseCtx.fillRect(nx, ny, nw, nh);
								}
								ctx.drawImage(
									noiseCanvas,
									0,
									0,
									w,
									Math.ceil(Math.min(burstH, noiseCanvas.height)),
									0,
									Math.floor(burstY),
									w,
									Math.ceil(burstH)
								);
							}
						}

						heroRaf = requestAnimationFrame(heroRender);
					}

					var img = new Image();
					img.onload = function() {
						canvas.img = img;
						sizeCanvas();
						buildEdge(img);
						wrap.classList.add('ready');
						heroRaf = requestAnimationFrame(heroRender);
					};
					img.src = new URL(src, window.location.href).href;

					window.addEventListener('resize', function() {
						if (canvas.img) {
							sizeCanvas();
							buildEdge(canvas.img);
						}
					}, { passive: true });
					function onHeroVisibilityChange() {
						if (document.hidden) {
							if (heroRaf) cancelAnimationFrame(heroRaf);
							heroRaf = 0;
						} else if (canvas.img && !heroRaf) {
							heroRaf = requestAnimationFrame(heroRender);
						}
					}
					document.addEventListener('visibilitychange', onHeroVisibilityChange);
					window.addEventListener('beforeunload', function() { cancelAnimationFrame(heroRaf); }, { once: true });
				}
				initHeroCanvas();
			function initRedQueenTv() {
					var tv = document.querySelector('.rq-tv-screen');
					if (!tv) return;
					var ctx = tv.getContext('2d');
					if (!ctx) return;
					var width = tv.width;
					var height = tv.height;
					var source = tv.getAttribute('data-rq-src') || '';
					var source2 = tv.getAttribute('data-rq-src2') || '';
					if (!source) return;
					var raf = 0;
					var start = performance.now();
					var currentFrame = null;

					function drawFallback(elapsed) {
						ctx.clearRect(0, 0, width, height);
						ctx.fillStyle = 'rgba(124, 186, 224, 0.15)';
						ctx.beginPath();
						ctx.ellipse(width * 0.5, height * 0.52, 36, 44, 0, 0, Math.PI * 2);
						ctx.fill();
						ctx.strokeStyle = 'rgba(176, 226, 250, 0.66)';
						ctx.stroke();
						ctx.fillStyle = 'rgba(182, 232, 255, 0.08)';
						for (var i = 0; i < 6; i++) {
							var y = (elapsed * 34 + i * 42) % height;
							ctx.fillRect(0, y, width, 1);
						}
					}

					function drawOverlay(elapsed) {
						// scanlines
						ctx.globalCompositeOperation = 'screen';
						for (var i = 0; i < 7; i++) {
							var y = (elapsed * 28 + i * 36) % height;
							ctx.fillStyle = i % 2 ? 'rgba(188,238,255,0.05)' : 'rgba(188,238,255,0.08)';
							ctx.fillRect(0, y, width, 1);
						}
						ctx.globalCompositeOperation = 'source-over';
						// cyan tint overlay
						ctx.globalCompositeOperation = 'screen';
						ctx.fillStyle = 'rgba(154, 230, 255, 0.10)';
						ctx.fillRect(0, 0, width, height);
						ctx.globalCompositeOperation = 'source-over';
						// sweep light
						var sweepX = (Math.sin(elapsed * 0.9) * 0.5 + 0.5) * width;
						var sweep = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, 0);
						sweep.addColorStop(0, 'rgba(176, 230, 255, 0)');
						sweep.addColorStop(0.5, 'rgba(176, 230, 255, 0.12)');
						sweep.addColorStop(1, 'rgba(176, 230, 255, 0)');
						ctx.fillStyle = sweep;
						ctx.fillRect(0, 0, width, height);
					}

					function drawFrame(frame) {
						var fw = frame.displayWidth || frame.width;
						var fh = frame.displayHeight || frame.height;
						var scale = Math.max(width / fw, height / fh) * 1.4;
						var dw = fw * scale;
						var dh = fh * scale;
						var dx = (width - dw) / 2 - 160;
						var dy = (height - dh) / 2;
						if (playlist[playlistIndex] && playlist[playlistIndex].type === 'image/gif') dy += 20;
						ctx.save();
						ctx.translate(width, 0);
						ctx.scale(-1, 1);
						ctx.drawImage(frame, dx, dy, dw, dh);
						ctx.restore();
					}

					function renderLoop(t) {
						var elapsed = (t - start) * 0.001;
						ctx.clearRect(0, 0, width, height);
						if (currentFrame) {
							drawFrame(currentFrame);
						} else {
							drawFallback(elapsed);
						}
						drawOverlay(elapsed);
						raf = requestAnimationFrame(renderLoop);
					}

						// Playlist: webp -> gif (hold 500ms) -> gif (hold 500ms) -> webp -> loop from 1
						var playlist = [
							{ url: '/images/redqueen2.webp', type: 'image/webp' },
							{ url: '/images/redqueen1.gif', type: 'image/gif', holdLast: 500 },
							{ url: '/images/redqueen1.gif', type: 'image/gif', holdLast: 500 },
							{ url: '/images/redqueen2.webp', type: 'image/webp' }
						];
					var loopFrom = 1;
					var playlistIndex = 0;

					function playItem(index) {
						playlistIndex = index;
						var item = playlist[index];
						if (!item || typeof ImageDecoder === 'undefined') return;
						fetch(new URL(item.url, window.location.href).href)
							.then(function(response) { return response.body; })
							.then(function(body) {
								var decoder = new ImageDecoder({ data: body, type: item.type });
								var frameIndex = 0;
								function decodeNext() {
									decoder.decode({ frameIndex: frameIndex }).then(function(result) {
										if (currentFrame && currentFrame.close) currentFrame.close();
										currentFrame = result.image;
										frameIndex++;
										if (frameIndex >= decoder.tracks.selectedTrack.frameCount) {
											// finished this item, advance
											var nextIndex = index + 1;
											if (nextIndex >= playlist.length) nextIndex = loopFrom;
											var hold = item.holdLast || 0;
											setTimeout(function() { playItem(nextIndex); }, hold);
											return;
										}
										var delay = result.image.duration ? result.image.duration / 1000 : 33;
										setTimeout(decodeNext, delay);
									}).catch(function() {
										frameIndex = 0;
										setTimeout(decodeNext, 100);
									});
								}
								decoder.tracks.ready.then(function() {
									decodeNext();
								});
							}).catch(function(err) {
								console.warn('Playlist item failed', item.url, err);
								var nextIndex = index + 1;
								if (nextIndex >= playlist.length) nextIndex = loopFrom;
								playItem(nextIndex);
							});
					}

					if (typeof ImageDecoder !== 'undefined') {
						playItem(0);
					} else {
						var img = new Image();
						img.onload = function() { currentFrame = img; };
						img.src = new URL(source, window.location.href).href;
					}

					raf = requestAnimationFrame(renderLoop);
					function onTvVisibilityChange() {
						if (document.hidden) {
							if (raf) cancelAnimationFrame(raf);
							raf = 0;
						} else if (!raf) {
							start = performance.now();
							raf = requestAnimationFrame(renderLoop);
						}
					}
					document.addEventListener('visibilitychange', onTvVisibilityChange);
					window.addEventListener('beforeunload', function() { cancelAnimationFrame(raf); }, { once: true });
				}
				initRedQueenTv();

				// 鼠标跟随光斑
				var glow = document.querySelector('.mesh-mouse-glow');
				if (glow) {
					var raf;
					var x = 0, y = 0;
					document.addEventListener('mousemove', function(e) {
						x = e.clientX;
						y = e.clientY;
						if (!raf) raf = requestAnimationFrame(function() {
							glow.style.setProperty('--mouse-x', x + 'px');
							glow.style.setProperty('--mouse-y', y + 'px');
							raf = 0;
						});
					});
				}

				// 悬浮预览卡：为链接添加 data-preview
				document.querySelectorAll('.mesh-prose-body a[href]').forEach(function(a) {
					var href = a.getAttribute('href') || '';
					if (!href || href.startsWith('#')) return;
					a.classList.add('mesh-link-preview');
					try {
						a.setAttribute('data-preview', href.startsWith('http') ? new URL(href, location.origin).hostname : href);
					} catch (_) {
						a.setAttribute('data-preview', href);
					}
				});

				// 段落滚动浮现
				var paras = document.querySelectorAll('.mesh-prose-body p, .mesh-prose-body h2, .mesh-prose-body h3, .mesh-prose-body pre, .mesh-prose-body blockquote, .mesh-prose-body ul, .mesh-prose-body ol');
				if (window.IntersectionObserver) {
					var io = new IntersectionObserver(function(entries) {
						entries.forEach(function(e) {
							if (e.isIntersecting) {
								e.target.classList.add('mesh-para-visible');
								io.unobserve(e.target);
							}
						});
					}, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
					paras.forEach(function(p) { io.observe(p); });
				} else {
					paras.forEach(function(p) { p.classList.add('mesh-para-visible'); });
				}

				// Regenerate 按钮
				var regen = document.querySelector('.mesh-regenerate');
				var article = document.querySelector('.mesh-article');
				var scan = document.querySelector('.mesh-load-scan');
				if (regen && article) {
					regen.addEventListener('click', function() {
						regen.disabled = true;
						regen.classList.add('mesh-regenerating');
						article.classList.add('mesh-regenerate-flash');
						if (scan) {
							scan.style.animation = 'none';
							scan.offsetHeight;
							scan.style.animation = 'mesh-scan 0.8s ease-out forwards';
							scan.style.top = '0';
							scan.style.opacity = '1';
						}
						setTimeout(function() {
							article.classList.remove('mesh-regenerate-flash');
							regen.classList.remove('mesh-regenerating');
							regen.disabled = false;
						}, 1200);
					});
				}
			}

			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', init);
			} else {
				init();
			}
		})();
