describe('class', () => {
  it('the first argument is required', () => {
    expect(() => {
      new Lifecycle();
    }).to.throw();
  });

  it('the second argument is required', () => {
    expect(() => {
      new Lifecycle({});
    }).to.throw();
  });

  it('the second argument supports array', () => {
    expect(() => {
      new Lifecycle({}, []);
    }).to.not.throw();
  });

  it('the second argument supports object', () => {
    expect(() => {
      new Lifecycle({}, {});
    }).to.not.throw();
  });

  it('should add hooks automatically when the second argument is object', () => {
    let count = 0;
    const lifecycle = new Lifecycle({}, {
      stage1() {
        count += 1;
      },

      stage2() {
        count += 1;
      },

      stage3() {
        count += 1;
      },
    }, {
      autoEmit: true,
    });

    lifecycle.start().next().next();
    expect(count).to.equal(3);
  });

  it('should end immediately after started when only has one stage', () => {
    let count = 0;
    const lifecycle = new Lifecycle({}, {
      one() {
        count += 1;
      },
    }, {
      autoStart: true,
      autoEmit: true,
      autoEnd: true,
    });

    expect(count).to.equal(1);
    expect(lifecycle.active).to.be.false;
  });
});
