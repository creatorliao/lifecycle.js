describe('options', () => {
  describe('autoStart', () => {
    it('should not be started automatically by default', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3']);

      expect(lifecycle.active).to.be.false;
    });

    it('should be started automatically', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });

      expect(lifecycle.active).to.be.true;
    });
  });

  describe('autoEnd', () => {
    it('should not be ended automatically by default', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });

      lifecycle.goto('stage3');
      expect(lifecycle.active).to.be.true;
    });

    it('should be ended automatically', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
        autoEnd: true,
      });

      lifecycle.goto('stage3');
      expect(lifecycle.active).to.be.false;
    });
  });

  describe('autoEmit', () => {
    it('should not be emitted automatically by default', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
      });
      let emitted = false;

      lifecycle.on('stage3', () => {
        emitted = true;
      }).goto('stage3');
      expect(emitted).to.be.false;
    });

    it('should be emitted', () => {
      const lifecycle = new Lifecycle({}, ['stage1', 'stage2', 'stage3'], {
        autoStart: true,
        autoEmit: true,
      });
      let emitted = false;

      lifecycle.on('stage3', () => {
        emitted = true;
      }).goto('stage3');
      expect(emitted).to.be.true;
    });
  });
});
