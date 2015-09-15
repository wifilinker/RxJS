  var TakeUntilObservable = (function(__super__) {
    inherits(TakeUntilObservable, __super__);

    function TakeUntilObservable(source, other) {
      this.source = source;
      this.other = isPromise(other) ? observableFromPromise(other) : other;
      __super__.call(this);
    }

    TakeUntilObservable.prototype.subscribeCore = function(o) {
      return new BinaryDisposable(
        this.source.subscribe(o),
        this.other.subscribe(new InnerObserver(o))
      );
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(o) {
      this.o = o;
      AbstractObserver.call(this);
    }
    InnerObserver.prototype.next = function () {
      this.o.onCompleted();
    };
    InnerObserver.prototype.error = function (err) {
        this.o.onError(err);
    };
    InnerObserver.prototype.onCompleted = noop;

    return TakeUntilObservable;
  }(ObservableBase));

  /**
   * Returns the values from the source observable sequence until the other observable sequence produces a value.
   * @param {Observable | Promise} other Observable sequence or Promise that terminates propagation of elements of the source sequence.
   * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.
   */
  observableProto.takeUntil = function (other) {
    return new TakeUntilObservable(this, other);
  };
