import { TestBed } from '@angular/core/testing';

import { TokenIntercepterService } from './token-intercepter.service';

describe('TokenIntercepterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenIntercepterService = TestBed.get(TokenIntercepterService);
    expect(service).toBeTruthy();
  });
});
