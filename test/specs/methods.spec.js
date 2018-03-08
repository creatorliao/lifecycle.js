describe('methods', () => {
  describe('start', () => {
    it('should start the lifecycle', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3']);

      expect(lifecycle.active).to.be.false;
      lifecycle.start();
      expect(lifecycle.active).to.be.true;
    });
  });

  describe('end', () => {
    it('should end the lifecycle', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });

      expect(lifecycle.active).to.be.true;
      lifecycle.end();
      expect(lifecycle.active).to.be.false;
    });
  });

  describe('prev', () => {
    it('should switch to the previous stage', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });

      expect(lifecycle.next().is('stage2')).to.be.true;
      expect(lifecycle.prev().is('stage1')).to.be.true;
    });
  });

  describe('next', () => {
    it('should switch to the next stage', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });

      expect(lifecycle.next().is('stage2')).to.be.true;
    });
  });

  describe('goto', () => {
    it('should switch to the given stage', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });

      expect(lifecycle.goto('stage2').is('stage2')).to.be.true;
    });
  });

  describe('on', () => {
    it('should add the given stage hook', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });
      let emitted = false;

      lifecycle.on('stage1', () => {
        emitted = true;
      }).emit('stage1');
      expect(emitted).to.be.true;
    });

    it('should support multiple stages', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
        autoEmit: true,
      });
      let count = 0;

      lifecycle.on('stage2 stage3', () => {
        count += 1;
      }).next().next();
      expect(count).to.equal(2);
    });

    it('should support multiple stages (array)', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
        autoEmit: true,
      });
      let count = 0;

      lifecycle.on(['stage2', 'stage3'], () => {
        count += 1;
      }).next().next();
      expect(count).to.equal(2);
    });

    it('should support object', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
        autoEmit: true,
      });
      let count = 0;

      lifecycle.on({
        stage2: () => {
          count += 1;
        },

        stage3: () => {
          count += 1;
        },
      }).next().next();
      expect(count).to.equal(2);
    });

    it('should support multiple hooks (array)', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });
      let count = 0;

      lifecycle.on('stage1', [
        () => {
          count += 1;
        },

        () => {
          count += 1;
        },
      ]).emit('stage1');
      expect(count).to.equal(2);
    });

    it('should support `prepend` option', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });
      const list = [];

      lifecycle
        .on('stage1', () => {
          list.push('foo');
        })
        .on('stage1', () => {
          list.push('bar');
        }, {
          prepend: true,
        })
        .on('stage1', () => {
          list.push('baz');
        })
        .on('stage1', [
          () => {
            list.push('qux');
          },
          () => {
            list.push('quux');
          },
        ], {
          prepend: true,
        })
        .on('stage1', () => {
          list.push('corge');
        })
        .emit('stage1');
      expect(list.join(' ')).to.equal('qux quux bar foo baz corge');
    });

    it('should support `once` option', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });
      let count = 0;

      lifecycle.on('stage1', () => {
        count += 1;
      }, {
        once: true,
      }).emit('stage1');
      lifecycle.emit('stage1');
      lifecycle.emit('stage1');
      expect(count).to.equal(1);
    });
  });

  describe('once', () => {
    it('should execute the hook only once', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });
      let count = 0;

      lifecycle.once('stage1', () => {
        count += 1;
      });
      lifecycle.emit('stage1');
      lifecycle.emit('stage1');
      expect(count).to.equal(1);
    });
  });

  describe('off', () => {
    it('should remove the given stage hook', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });
      let emitted = false;
      const hook = () => {
        emitted = true;
      };

      lifecycle.on('stage1', hook).off('stage1', hook).emit('stage1');
      expect(emitted).to.be.false;
    });

    it('should support multiple stages', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
        autoEmit: true,
      });
      let count = 0;

      lifecycle.on('stage2 stage3', () => {
        count += 1;
      }).off('stage2 stage3').next().next();
      expect(count).to.equal(0);
    });

    it('should support multiple stages (array)', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
        autoEmit: true,
      });
      let count = 0;

      lifecycle.on(['stage2', 'stage3'], () => {
        count += 1;
      }).off('stage2 stage3').next().next();
      expect(count).to.equal(0);
    });

    it('should support object', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
        autoEmit: true,
      });
      let count = 0;
      const hooks = {
        stage2: () => {
          count += 1;
        },

        stage3: () => {
          count += 1;
        },
      };

      lifecycle.on(hooks).off(hooks).next().next();
      expect(count).to.equal(0);
    });

    it('should remove all hooks', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
        autoEmit: true,
      });
      let count = 0;

      lifecycle.on('stage2', [
        () => {
          count += 1;
        },
        () => {
          count += 1;
        },
      ]).off('stage2').next();
      expect(count).to.equal(0);
    });
  });

  describe('emit', () => {
    it('should execute the hook of the given stage after emitted', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });
      let executed = false;

      lifecycle.on('stage1', () => {
        executed = true;
      }).emit('stage1');
      expect(executed).to.be.true;
    });

    it('should match the given parameters when execute the stage hook', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });

      lifecycle.on('stage1', (...args) => {
        expect(args[0]).to.equal(1);
        expect(args[1]).to.equal(2);
      }).emit('stage1', 1, 2);
    });
  });

  describe('is', () => {
    it('should return the current stage', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });

      expect(lifecycle.is('stage1')).to.be.true;
      expect(lifecycle.next().is('stage2')).to.be.true;
    });
  });
});
